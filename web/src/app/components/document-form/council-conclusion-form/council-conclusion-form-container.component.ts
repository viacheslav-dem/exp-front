import {Component, ElementRef, ViewChild, ViewContainerRef, ChangeDetectionStrategy, ChangeDetectorRef, computed, effect, input, Type} from '@angular/core';
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
      : ChangeDetectionStrategy.Default
})
export class CouncilConclusionFormContainerComponent extends DocumentForm<CouncilConclusionFormContent> {

  Role = Role;

  // Управляемое состояние загрузки (прокидывается из контейнера, где выполняется HTTP)
  readonly loading = input<boolean>(false);

  documents: Text[] = [];
  formComponent: CouncilConclusionForm;


  @ViewChild(SearchPersonByRolesComponent, { static: false }) public searchPersonModal: SearchPersonByRolesComponent;
  @ViewChild('form', { read: ViewContainerRef, static: true }) formContainer: any;

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

  private readonly projectEffect = effect(() => {
    const project = this.project();
    if (!project?.code?.code) {
      return;
    }
    this.updateFormComponent(this._formTypeResolver.getFormRenderer(project.code.code));
  });

  readonly groupInput = input<LifecycleGroupDto>(undefined, { alias: 'group' });
  readonly group = computed(() => this.groupInput());

  private readonly groupEffect = effect(() => {
    const group = this.group();
    if (!group) {
      return;
    }
    this._form.chairman = this._form.chairman || group.bureauChairman;
    if (this.formComponent) {
      this.formComponent.group = group;
    }
    this.cdr.markForCheck();
  });

  updateFormComponent(_formRenderer: Type<CouncilConclusionForm>) {
    if (!_formRenderer) {
      return;
    }
    this.formContainer.clear();
    const componentRef = this.formContainer.createComponent(_formRenderer);
    this.formComponent = componentRef.instance;
    this.formComponent.parent = this;
    this.formComponent.project = this.project();
    this.formComponent.group = this.group();
    this.formComponent.setForm(this._form.projectProtocol);
    // Синхронная отрисовка динамического компонента
    componentRef.changeDetectorRef.detectChanges();
    this.cdr.markForCheck();
  }

  validate() {
    super.validate();
    this.formComponent.validate();
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
    let form = super.getForm();
    form.projectProtocol = this.formComponent.getForm();
    form.documents = this.documents.map(obj => obj.text).filter(document => !isEmptyOrNull(document));
    return form;
  }

  setForm(form: CouncilConclusionFormContent) {
    super.setForm(form);
    this._form.projectProtocol = this._form.projectProtocol || new AgendaNewFormContent();
    const group = this.group();
    this._form.chairman = this._form.chairman || group?.bureauChairman;
    this._form.documents = this._form.documents || [];
    this.documents = this._form.documents.map(d => new Text(d));
    this._form.innerExpertiseDate = this._form.innerExpertiseDate || dayjs().valueOf();
    if (this.formComponent) {
      this.formComponent.setForm(this._form.projectProtocol);
    }
    // OnPush: данные формы изменились - запрашиваем перерисовку
    this.cdr.markForCheck();
  }

  showSearchChairmanModal() {
    this.searchPersonModal.show();
  }

  selectPerson(person: PersonPlainDto) {
    this._form.chairman = person;
    this.searchPersonModal.hide();
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
