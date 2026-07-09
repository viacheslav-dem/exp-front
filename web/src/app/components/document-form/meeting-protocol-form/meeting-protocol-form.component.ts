import {Component, ElementRef, Type, ViewContainerRef, input, ChangeDetectionStrategy, ChangeDetectorRef, signal, effect, viewChild} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MeetingDto} from "@app/dto/MeetingDto";
import {DocumentForm} from "@app/components/document-form/document-form";
import {Role} from "@app/pipes/role.pipe";
import {SearchPersonByRolesComponent} from "@app/components/search/search-person/search-person-by-role.component";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {MeetingService} from "@app/services/meeting.service";
import {AgendaFormResolver} from "@app/components/document-form/meeting-protocol-form/agenda-form-resolver.service";
import {compareByField, isEmptyOrNull, sortPersonsByName} from "@app/support/utils";
import {PersonService} from "@app/services/person.service";
import dayjs from 'dayjs';
import {RemarksContainerDto} from "@app/dto/RemarksContainerDto";
import {MeetingProtocolNewFormContent} from "@app/components/document-form/meeting-protocol-form/MeetingProtocolNewFormContent";
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";
import {createTrackKeyStore} from "@app/support/utils";
import {environment} from "../../../../environments/environment";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {FormValidationScrollService} from "@app/services/form-validation-scroll.service";

@Component({
    selector: 'app-meeting-protocol-form',
    templateUrl: 'meeting-protocol-form.component.html',
    styles: [`
      ::ng-deep .hint {
          margin-top: 0.5rem;
          font-style: italic;
          font-size: 0.875rem;
      }

      ::ng-deep .hint p {
          margin-bottom: 0.5rem;
      }

      ::ng-deep .hint ul {
          margin-bottom: 0.5rem;
      }
  `],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.meetings)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class MeetingProtocolFormComponent extends DocumentForm<MeetingProtocolNewFormContent> {

  _meeting: MeetingDto;
  private _currentMeetingId: number | null = null;
  readonly role = input<string>(undefined);
  readonly meeting = input<MeetingDto | undefined>(undefined);
  // destroyRef уже доступен из базового класса DocumentForm
  private readonly _meetingEffect = effect(() => {
    const meeting = this.meeting();
    if (!meeting) return;

    // Защита от повторных вызовов для того же meeting
    if (this._currentMeetingId === meeting.id) return;
    this._currentMeetingId = meeting.id;

    this._meeting = meeting;
    this.openedAgendaProjectId.set(null);
    this.patchForm({ endDate: this.formValue().endDate || this._meeting.period.end } as Partial<MeetingProtocolNewFormContent>);
    
    // Добавляем takeUntilDestroyed для предотвращения утечек памяти и бесконечных запросов
    this._meetingService.getMeetingAssessors(this._meeting)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        sortPersonsByName(res);
        this.assessors = res;
        this.assessors.forEach(ass => ass.isChecked = this.formValue().participants.some(selected => selected.id == ass.id));
        this.cdr?.markForCheck?.(); // Нужен для асинхронного subscribe, так как это не signal операция
      });
    this.prepareAgendaForms();
    // При использовании signals effect автоматически триггерит change detection,
    // markForCheck() в конце effect избыточен и может вызывать бесконечные циклы
  });
  // Управляемое состояние загрузки (прокидывается из контейнера, где выполняется HTTP)
  readonly loading = input<boolean>(false);
  currentPerson: PersonPlainDto;
  assessors: PersonPlainDto[] = [];
  invited: { name: string }[] = [];
  searchPersonRoles: Role[] | string[] | string = "none";
  agendaComponents: { [key: number]: AgendaNewForm } = {};

  // Аккордеон: открыт максимум один проект за раз.
  readonly openedAgendaProjectId = signal<number | null>(null);
  public readonly searchPersonModal = viewChild(SearchPersonByRolesComponent);
  readonly formContainer = viewChild('form', { read: ViewContainerRef });

  constructor(private _personService: PersonService,
              private _meetingService: MeetingService,
              private _agendaFormResolver: AgendaFormResolver,
              private cdr: ChangeDetectorRef,
              private readonly hostRef: ElementRef<HTMLElement>,
              private readonly toasty: GlobalToastyService,
              private readonly validationScrollService: FormValidationScrollService) {
    super();
  }

  private readonly _trackKey = createTrackKeyStore<object>('meeting-protocol-invited:');

  trackInvited(person: { name: string }): string {
    return this._trackKey(person);
  }

  addInvited(): void {
    this.invited.push({ name: '' });
    this.cdr?.markForCheck?.();
  }

  ngOnInit() {
    super.ngOnInit();
    this._personService.getCurrentPerson()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.currentPerson = res;
        this.patchForm({ chairman: this.formValue().chairman || this.currentPerson } as Partial<MeetingProtocolNewFormContent>);
        this.cdr?.markForCheck?.();
      });
  }

  createNewForm(): MeetingProtocolNewFormContent {
    return new MeetingProtocolNewFormContent();
  }

  toggleAgendaProject(projectId: number | undefined | null) {
    if (projectId == null) {
      return;
    }
    // Сохраняем текущий открытый ID перед изменением
    const previousOpenedId = this.openedAgendaProjectId();
    // Проверяем, закрывается ли какой-либо проект (был открыт проект)
    const isClosingProject = previousOpenedId !== null;
    
    this.openedAgendaProjectId.update(curr => (curr === projectId ? null : projectId));
    
    // Сохраняем черновик при сворачивании accordion (когда проект закрывается)
    // Это гарантирует сохранение данных заполненных полей даже если они были изменены
    // незадолго до сворачивания (до следующего автосохранения каждые 30 секунд)
    if (isClosingProject) {
      this.saveDraft();
    }
    
    this.cdr?.markForCheck?.();
  }

  prepareAgendaForms() {
    const container = this.formContainer();
    if (!container) return;
    while (container.length > 0) {
      container.get(0).destroy();
    }
    const form = this.formValue();
    this._meeting.agendas.sort(compareByField('id'));
    this._meeting.agendas.forEach((agenda, i) => {
      let formRenderer: Type<AgendaNewForm> = this._agendaFormResolver.getFormRenderer(agenda.project.code.code);
      if (formRenderer) {
        const componentRef = container.createComponent(formRenderer);
        let component: AgendaNewForm = this.agendaComponents[agenda.project.id] = componentRef.instance;
        component.ind = i;
        component.project = agenda.project;
        component.parent = this;
        component.setForm(form.projectsById?.[agenda.project.id]);
        let dto = new RemarksContainerDto();
        dto.project = agenda.project;
        dto.meeting = this._meeting;
        // Добавляем takeUntilDestroyed для предотвращения утечек памяти и бесконечных запросов
        this._meetingService.getRemarks(dto)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(value => {
            if (((value.sectionMeetingRemark != null && value.sectionMeetingRemark.length > 0)
              || (value.bureauMeetingRemark != null && value.bureauMeetingRemark.length > 0))
              && !agenda.isAnswerReceived) {
              component.canRescheduled = true;
            } else if (!form.projectsById?.[agenda.project.id]) {
              component.patchForm({ customerReplies: true });
            }
            this.cdr?.markForCheck?.();
          });
      }
    })
  }

  participantsChanged() {
    this.patchForm({ participants: this.assessors.filter(assessor => assessor.isChecked) } as Partial<MeetingProtocolNewFormContent>);
  }

  showSearchChairmanModal() {
    this.searchPersonRoles = this.role();
    this.searchPersonModal()?.show();
  }

  selectPerson(person: PersonPlainDto) {
    this.patchForm({ chairman: person } as Partial<MeetingProtocolNewFormContent>);
    this.searchPersonModal()?.hide();
  }

  validate() {
    super.validate();
    const form = this.formValue();
    let endDate = dayjs(form.endDate);
    let meetingEndWithTime = dayjs(this._meeting.period.end).hour(endDate.hour()).minute(endDate.minute());
    if (meetingEndWithTime.valueOf() <= this._meeting.period.start) {
      throw 'Время окончания должно следовать за временем начала заседания.';
    }
    this._meeting.agendas.forEach(agenda => {
      const comp = this.agendaComponents[agenda.project.id];
      if (comp) comp.validate();
    });
  }

  /**
   * UX: при ошибке валидации автоматически прокрутить к первой ошибке,
   * не требуя массовых правок форм/блоков.
   */
  override save() {
    // 1) Сначала проверяем "стандартную" валидацию Angular (required/minlength/etc).
    // Если уже есть .ng-invalid — не запускаем validate()+throw, а мягко ведём пользователя к полю.
    if (this.validationScrollService.hasInvalidControls(this.hostRef?.nativeElement)) {
      const firstVisibleInvalid = this.validationScrollService.getFirstInvalidElement(this.hostRef?.nativeElement);
      const firstInvalid = firstVisibleInvalid
        ?? this.validationScrollService.getFirstInvalidElementIgnoreVisibility(this.hostRef?.nativeElement);
      const fieldName = firstInvalid ? this.validationScrollService.getFieldLabel(firstInvalid) : null;
      const agendaItemLabel = firstInvalid ? this.validationScrollService.getAgendaItemLabel(firstInvalid) : null;
      const errorType = firstInvalid ? this.validationScrollService.getFieldErrorType(firstInvalid) : null;
      // Название пункта повестки — только когда проект свёрнут (первый невалидный не виден)
      const isInsideCollapsedBlock = firstVisibleInvalid == null && firstInvalid != null;
      const prefix = (agendaItemLabel && isInsideCollapsedBlock) ? `В пункте повестки «${agendaItemLabel}»: ` : '';
      this.validationScrollService.scrollToFirstInvalidSoon(this.hostRef);
      let message = 'Заполните обязательные поля и проверьте минимальную длину текста.';
      if (fieldName) {
        if (errorType === 'required') {
          message = prefix ? `${prefix}заполните обязательное поле "${fieldName}".` : `Заполните обязательное поле "${fieldName}".`;
        } else if (errorType === 'minlength') {
          const minLength = firstInvalid?.getAttribute('minlength') || '30';
          message = prefix ? `${prefix}поле "${fieldName}" должно содержать не менее ${minLength} символов.` : `Поле "${fieldName}" должно содержать не менее ${minLength} символов.`;
        } else if (errorType === 'min') {
          const min = firstInvalid?.getAttribute('min') || '0';
          message = prefix ? `${prefix}поле "${fieldName}" должно быть не менее ${min}.` : `Поле "${fieldName}" должно быть не менее ${min}.`;
        } else {
          message = prefix ? `${prefix}заполните обязательное поле "${fieldName}" и проверьте минимальную длину текста.` : `Заполните обязательное поле "${fieldName}" и проверьте минимальную длину текста.`;
        }
      } else if (agendaItemLabel && isInsideCollapsedBlock) {
        message = `Заполните обязательные поля в пункте повестки «${agendaItemLabel}».`;
      }
      this.toasty?.warn?.(message);
      return;
    }

    // 2) Пока миграция не завершена — остаётся ручная бизнес-валидация через validate()+throw.
    try {
      super.save();
    } catch (e) {
      this.validationScrollService.scrollToFirstInvalidSoon(this.hostRef);
      throw e;
    }
  }

  getForm() {
    const form = super.getForm();
    form.invited = this.invited.map(person => person.name).filter(str => !isEmptyOrNull(str));
    const existingProjectsById = form.projectsById || {};
    form.projectsById = { ...existingProjectsById };
    this._meeting.agendas.forEach(agenda => {
      const projectId = agenda.project.id;
      const comp = this.agendaComponents[projectId];
      if (comp) form.projectsById[projectId] = comp.getForm();
    });
    const endDate = dayjs(form.endDate);
    form.endDate = dayjs(this._meeting.period.end).hour(endDate.hour()).minute(endDate.minute()).valueOf();
    return form;
  }

  setForm(form: MeetingProtocolNewFormContent) {
    super.setForm(form);
    // Важно: updateForm должен возвращать НОВЫЙ объект, иначе signal может не уведомить (Object.is === true).
    this.updateForm(f => ({
      ...f,
      participants: f.participants || [],
      invited: f.invited || [],
      projectsById: f.projectsById || {},
      chairman: f.chairman || this.currentPerson,
    }));
    const f = this.formValue();
    this.invited = f.invited.map(name => ({ name }));
    if (this._meeting?.agendas) {
      this._meeting.agendas.map(agenda => agenda.project.id).forEach(projectId => {
        if (this.agendaComponents[projectId]) {
          this.agendaComponents[projectId].setForm(f.projectsById[projectId]);
        }
      });
    }
    this.assessors.forEach(ass => ass.isChecked = f.participants.some(selected => selected.id == ass.id));
    this.cdr?.markForCheck?.();
  }


}
