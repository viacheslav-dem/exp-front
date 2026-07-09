import {Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, ChangeDetectorRef, computed, effect, input, Type, viewChild, untracked} from '@angular/core';
import {DocumentForm} from "@app/components/document-form/document-form";
import {SearchPersonByRolesComponent} from "@app/components/search/search-person/search-person-by-role.component";
import {Role} from "@app/pipes/role.pipe";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import dayjs from 'dayjs';
import {PersonService} from "@app/services/person.service";
import {ProjectDto} from "@app/dto/ProjectDto";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {ProjectCodePlainDto} from "@app/dto/ProjectCodePlainDto";
import {CouncilConclusionFormContent} from "@app/components/document-form/form-model/CouncilConclusionFormContent";
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";
import {AgendaNewFormContent} from "@app/components/document-form/meeting-protocol-form/AgendaNewFormContent";
import {isEmptyOrNull} from "@app/support/utils";
import {Text} from "@app/components/document-form/form-model/Text";
import {CouncilConclusionFormResolver} from "@app/components/document-form/council-conclusion-form/council-conclusion-form-resolver.service";
import {createTrackKeyStore} from "@app/support/utils";
import {environment} from "../../../../environments/environment";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {FormValidationScrollService} from "@app/services/form-validation-scroll.service";

@Component({
    selector: 'app-council-conclusion-form',
    templateUrl: './council-conclusion-form-container.component.html',
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
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class CouncilConclusionFormContainerComponent extends DocumentForm<CouncilConclusionFormContent> {

  Role = Role;

  // Управляемое состояние загрузки (прокидывается из контейнера, где выполняется HTTP)
  readonly loading = input<boolean>(false);

  documents: Text[] = [];
  formComponent: CouncilConclusionForm;


  public readonly searchPersonModal = viewChild(SearchPersonByRolesComponent);
  readonly formContainer = viewChild('form', { read: ViewContainerRef });

  constructor(private _personService: PersonService,
              private _formTypeResolver: CouncilConclusionFormResolver,
              private cdr: ChangeDetectorRef,
              private readonly hostRef: ElementRef<HTMLElement>,
              private readonly toasty: GlobalToastyService,
              private readonly validationScrollService: FormValidationScrollService) {
    super();
  }

  private readonly _trackKey = createTrackKeyStore<object>('council-conclusion-doc:');

  trackText(doc: Text): string {
    return this._trackKey(doc);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  createNewForm(): CouncilConclusionFormContent {
    return new CouncilConclusionFormContent();
  }

  readonly projectInput = input<ProjectDto>(undefined, { alias: 'project' });
  readonly project = computed(() => this.projectInput());

  private _lastProjectCode: string | undefined;
  private _lastFormRenderer: Type<CouncilConclusionForm> | undefined;

  private readonly projectEffect = effect(() => {
    const project = this.project();
    if (!project?.code?.code) {
      return;
    }
    // Проверяем, действительно ли код проекта изменился
    if (this._lastProjectCode === project.code.code && this._lastFormRenderer) {
      return;
    }
    const formRenderer = this._formTypeResolver.getFormRenderer(project.code.code);
    // Проверяем, действительно ли renderer изменился
    if (this._lastFormRenderer === formRenderer && this.formComponent) {
      return;
    }
    this._lastProjectCode = project.code.code;
    this._lastFormRenderer = formRenderer;
    untracked(() => {
      this.updateFormComponent(formRenderer);
    });
  });

  readonly groupInput = input<LifecycleGroupDto>(undefined, { alias: 'group' });
  readonly group = computed(() => this.groupInput());

  private readonly groupEffect = effect(() => {
    const group = this.group();
    if (!group) {
      return;
    }
    // Используем untracked, чтобы избежать зависимости от formValue() в effect
    // и проверяем, действительно ли нужно обновить chairman
    untracked(() => {
      const currentChairman = this.formValue().chairman;
      const newChairman = currentChairman || group.bureauChairman;
      // Обновляем только если значение действительно изменилось
      if (currentChairman !== newChairman) {
        this.patchForm({ chairman: newChairman } as Partial<CouncilConclusionFormContent>);
      }
    });
    if (this.formComponent) {
      this.formComponent.group = group;
    }
    // При использовании signals effect автоматически триггерит change detection,
    // markForCheck() не нужен и может вызывать бесконечные циклы
  });

  updateFormComponent(_formRenderer: Type<CouncilConclusionForm>) {
    if (!_formRenderer) return;
    const container = this.formContainer();
    if (!container) return;
    container.clear();
    const componentRef = container.createComponent(_formRenderer);
    this.formComponent = componentRef.instance;
    this.formComponent.parent = this;
    this.formComponent.project = this.project();
    this.formComponent.group = this.group();
    this.formComponent.setForm(this.formValue().projectProtocol);
    // Синхронная отрисовка динамического компонента
    componentRef.changeDetectorRef.detectChanges();
    // При использовании signals и OnPush: если updateFormComponent вызывается из effect,
    // effect уже триггерит change detection. markForCheck() избыточен и может вызывать циклы.
    // detectChanges() уже выполнен выше для синхронной отрисовки.
  }

  validate() {
    super.validate();
    if (this.formComponent) this.formComponent.validate();
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

  getForm(): CouncilConclusionFormContent {
    const form = super.getForm();
    if (this.formComponent) {
      const componentForm = this.formComponent.getForm();
      // selectedDirections и selectedSocialEconomicGoals управляются контейнером
      // (app-select-directions-and-goals-block), а не дочерним formComponent.
      // Без merge они теряются при перезаписи projectProtocol.
      componentForm.selectedDirections = form.projectProtocol?.selectedDirections || [];
      componentForm.selectedSocialEconomicGoals = form.projectProtocol?.selectedSocialEconomicGoals || [];
      componentForm.directionsAndGoalsText = form.projectProtocol?.directionsAndGoalsText || componentForm.directionsAndGoalsText;
      form.projectProtocol = componentForm;
    }
    form.documents = this.documents.map(obj => obj.text).filter(document => !isEmptyOrNull(document));
    return form;
  }

  setForm(form: CouncilConclusionFormContent) {
    super.setForm(form);
    // Важно: updateForm должен возвращать НОВЫЙ объект, иначе signal может не уведомить (Object.is === true).
    this.updateForm(f => {
      const group = this.group();
      return {
        ...f,
        projectProtocol: f.projectProtocol || new AgendaNewFormContent(),
        chairman: f.chairman || group?.bureauChairman,
        documents: f.documents || [],
        innerExpertiseDate: f.innerExpertiseDate || dayjs().valueOf(),
      };
    });
    const f = this.formValue();
    this.documents = f.documents.map(d => new Text(d));
    if (this.formComponent) {
      this.formComponent.setForm(f.projectProtocol);
    }
    // При использовании signals updateForm() автоматически триггерит change detection,
    // markForCheck() избыточен и может вызывать бесконечные циклы
  }

  showSearchChairmanModal() {
    this.searchPersonModal()?.show();
  }

  selectPerson(person: PersonPlainDto) {
    this.patchForm({ chairman: person } as Partial<CouncilConclusionFormContent>);
    this.searchPersonModal()?.hide();
  }

  patchProjectProtocol(patch: Partial<AgendaNewFormContent>) {
    this.updateForm(f => ({
      ...f,
      projectProtocol: { ...f.projectProtocol, ...patch }
    } as CouncilConclusionFormContent));
  }

  needSelectDirections() {
    return !ProjectCodePlainDto.isCodeIn(this.project()?.code?.code, 9, 10, 13);
  }

  is_8_9() {
    return ProjectCodePlainDto.isCode(this.project()?.code?.code, 9);
  }

  addDocument() {
    this.documents.push(new Text());
  }

  /**
   * Публичный метод для явного запуска change detection.
   * Используется родительским компонентом при открытии модалки в zoneless/OnPush режиме.
   */
  markForCheck() {
    this.cdr.markForCheck();
  }
}
