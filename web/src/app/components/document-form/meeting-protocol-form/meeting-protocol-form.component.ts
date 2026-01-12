import {Component, ElementRef, Input, Type, ViewChild, ViewContainerRef, input, ChangeDetectionStrategy, ChangeDetectorRef, signal} from "@angular/core";
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
      : ChangeDetectionStrategy.Default
})
export class MeetingProtocolFormComponent extends DocumentForm<MeetingProtocolNewFormContent> {

  _meeting: MeetingDto;
  readonly role = input<string>(undefined);
  // Управляемое состояние загрузки (прокидывается из контейнера, где выполняется HTTP)
  readonly loading = input<boolean>(false);
  currentPerson: PersonPlainDto;
  assessors: PersonPlainDto[] = [];
  invited: { name: string }[] = [];
  searchPersonRoles: Role[] | string[] | string = "none";
  agendaComponents: { [key: number]: AgendaNewForm } = {};

  // Аккордеон: открыт максимум один проект за раз.
  readonly openedAgendaProjectId = signal<number | null>(null);
  @ViewChild(SearchPersonByRolesComponent, { static: false }) public searchPersonModal: SearchPersonByRolesComponent;
  @ViewChild('form', { read: ViewContainerRef, static: true }) formContainer: any;

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
    this._personService.getCurrentPerson().subscribe(res => {
      this.currentPerson = res;
      this._form.chairman = this._form.chairman || this.currentPerson;
      this.cdr?.markForCheck?.();
    });
  }

  createNewForm(): MeetingProtocolNewFormContent {
    return new MeetingProtocolNewFormContent();
  }

  @Input() set meeting(meeting: MeetingDto) {
    this._meeting = meeting;
    // При смене заседания сбрасываем открытый проект, чтобы не "залипало" состояние.
    this.openedAgendaProjectId.set(null);
    this._form.endDate = this._form.endDate || this._meeting.period.end;
    this._meetingService.getMeetingAssessors(this._meeting).subscribe(res => {
      sortPersonsByName(res);
      this.assessors = res;
      this.assessors.forEach(ass => ass.isChecked = this._form.participants.some(selected => selected.id == ass.id));
      this.cdr?.markForCheck?.();
    });
    this.prepareAgendaForms();
    this.cdr?.markForCheck?.();
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
    while (this.formContainer.length > 0) {
      this.formContainer.get(0).destroy();
    }
    this._meeting.agendas.sort(compareByField('id'));
    this._meeting.agendas.forEach((agenda, i) => {
      let formRenderer: Type<AgendaNewForm> = this._agendaFormResolver.getFormRenderer(agenda.project.code.code);
      if (formRenderer) {
        const componentRef = this.formContainer.createComponent(formRenderer);
        let component: AgendaNewForm = this.agendaComponents[agenda.project.id] = componentRef.instance;
        component.ind = i;
        component.project = agenda.project;
        component.parent = this;
        component.setForm(this._form.projectsById[agenda.project.id]);
        let dto = new RemarksContainerDto();
        dto.project = agenda.project;
        dto.meeting = this._meeting;
        this._meetingService.getRemarks(dto).subscribe(value => {
          if (((value.sectionMeetingRemark != null && value.sectionMeetingRemark.length > 0)
            || (value.bureauMeetingRemark != null && value.bureauMeetingRemark.length > 0))
            && !agenda.isAnswerReceived) {
            component.canRescheduled = true;
          } else if (!this._form.projectsById[agenda.project.id]) {
            component._form.customerReplies = true;
          }
          this.cdr?.markForCheck?.();
        });
      }
    })
  }

  participantsChanged() {
    this._form.participants = this.assessors.filter(assessor => assessor.isChecked);
  }

  showSearchChairmanModal() {
    this.searchPersonRoles = this.role();
    this.searchPersonModal.show();
  }

  selectPerson(person: PersonPlainDto) {
    this._form.chairman = person;
    this.searchPersonModal.hide();
  }

  validate() {
    // Инкрементальная миграция: min="0" реализован через template-driven validators в HTML,
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
    // Бизнес-валидация: проверка времени окончания заседания
    let endDate = dayjs(this._form.endDate);
    let meetingEndWithTime = dayjs(this._meeting.period.end).hour(endDate.hour()).minute(endDate.minute());
    if (meetingEndWithTime.valueOf() <= this._meeting.period.start) {
      throw 'Время окончания должно следовать за временем начала заседания.';
    }
    this._meeting.agendas.forEach(agenda => this.agendaComponents[agenda.project.id].validate());
  }

  /**
   * UX: при ошибке валидации автоматически прокрутить к первой ошибке,
   * не требуя массовых правок форм/блоков.
   */
  override save() {
    // 1) Сначала проверяем "стандартную" валидацию Angular (required/minlength/etc).
    // Если уже есть .ng-invalid — не запускаем validate()+throw, а мягко ведём пользователя к полю.
    if (this.validationScrollService.hasInvalidControls(this.hostRef?.nativeElement)) {
      const firstInvalid = this.validationScrollService.getFirstInvalidElement(this.hostRef?.nativeElement);
      const fieldName = firstInvalid ? this.validationScrollService.getFieldLabel(firstInvalid) : null;
      const errorType = firstInvalid ? this.validationScrollService.getFieldErrorType(firstInvalid) : null;
      this.validationScrollService.scrollToFirstInvalidSoon(this.hostRef);
      // Сообщение с названием поля и типом ошибки
      let message = 'Заполните обязательные поля и проверьте минимальную длину текста.';
      if (fieldName) {
        if (errorType === 'required') {
          message = `Заполните обязательное поле "${fieldName}".`;
        } else if (errorType === 'minlength') {
          const minLength = firstInvalid?.getAttribute('minlength') || '30';
          message = `Поле "${fieldName}" должно содержать не менее ${minLength} символов.`;
        } else if (errorType === 'min') {
          const min = firstInvalid?.getAttribute('min') || '0';
          message = `Поле "${fieldName}" должно быть не менее ${min}.`;
        } else {
          message = `Заполните обязательное поле "${fieldName}" и проверьте минимальную длину текста.`;
        }
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
    let form = super.getForm();
    form.invited = this.invited.map(person => person.name).filter(str => !isEmptyOrNull(str));
    form.projectsById = {};
    this._meeting.agendas.map(agenda => agenda.project.id).forEach(projectId =>
      form.projectsById[projectId] = this.agendaComponents[projectId].getForm());
    let endDate = dayjs(form.endDate);
    form.endDate = dayjs(this._meeting.period.end).hour(endDate.hour()).minute(endDate.minute()).valueOf();
    return form;
  }

  setForm(form: MeetingProtocolNewFormContent) {
    super.setForm(form);
    this._form.participants = this._form.participants || [];
    this._form.invited = this._form.invited || [];
    this._form.projectsById = this._form.projectsById || {};
    this._form.chairman = this._form.chairman || this.currentPerson;
    this.invited = this._form.invited.map(name => ({ name }));
    if (this._meeting?.agendas) {
      this._meeting.agendas.map(agenda => agenda.project.id).forEach(projectId => {
        if (this.agendaComponents[projectId]) {
          this.agendaComponents[projectId].setForm(this._form.projectsById[projectId]);
        }
      });
    }
    this.assessors.forEach(ass => ass.isChecked = this._form.participants.some(selected => selected.id == ass.id));
    // Обновление представления после загрузки данных из черновика
    // Необходимо для OnPush change detection, чтобы данные отображались сразу после загрузки
    this.cdr?.markForCheck?.();
  }


}
