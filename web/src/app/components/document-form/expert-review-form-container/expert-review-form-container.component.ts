import {Component, ElementRef, Input, input, ChangeDetectionStrategy, ChangeDetectorRef, ComponentFactoryResolver} from "@angular/core";
import {DocumentFormContainerComponent} from "@app/components/document-form/document-form-container/document-form-container.component";
import {ProjectDto} from "@app/dto/ProjectDto";
import {ExpertReviewFormContent} from "@app/components/document-form/form-model/ExpertReviewFormContent";
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {TemplateType} from "@app/components/document-form/form-model/TemplateType";
import {DraftService} from "@app/components/document-form/draft.service";
import {IdDto} from "@app/dto/IdDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {FormValidationScrollService} from "@app/services/form-validation-scroll.service";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-expert-review-form',
    templateUrl: 'expert-review-form-container.component.html',
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
export class ExpertReviewFormContainerComponent<Form extends ExpertReviewFormContent> extends DocumentFormContainerComponent<Form> {
  
  constructor(
    resolver: ComponentFactoryResolver,
    cdr: ChangeDetectorRef,
    private readonly hostRef: ElementRef<HTMLElement>,
    private readonly toasty: GlobalToastyService,
    private readonly validationScrollService: FormValidationScrollService
  ) {
    super(resolver, cdr);
  }

  _project: ProjectDto;

  // Управляемое состояние загрузки (прокидывается из контейнера, где выполняется HTTP)
  readonly loading = input<boolean>(false);

  // Override parent @Input to expose as component input (parent field is used directly)
  readonly draftService = input<DraftService<Form>>(undefined);
  readonly draftOwner = input<IdDto>(undefined);

  @Input()
  set project(project) {
    this._project = project;
    this.update();
  }

  updateFormComponent(formRenderer) {
    super.updateFormComponent(formRenderer);
    this.update();
  }

  private update() {
    if (this.formComponent) {
      (this.formComponent as ExpertReviewForm<Form>).parent = this;
      (this.formComponent as ExpertReviewForm<Form>).project = this._project;
    }
  }

  validate() {
    super.validate();
    if (!this._form.hours || this._form.hours < 1) {
      throw 'Количество часов должно быть положительным числом.';
    }
  }

  /**
   * UX: при ошибке валидации автоматически прокрутить к первой ошибке,
   * не требуя массовых правок форм/блоков.
   *
   * Важно: мы НЕ гасим исключение — оно всё так же улетает в CustomErrorHandler и показывает toast.
   */
  override save() {
    // 1) Сначала проверяем "стандартную" валидацию Angular (required/minlength/etc).
    // Если уже есть .ng-invalid — не запускаем validate()+throw, а мягко ведём пользователя к полю.
    if (this.validationScrollService.hasInvalidControls(this.hostRef?.nativeElement)) {
      const firstInvalid = this.validationScrollService.getFirstInvalidElement(this.hostRef?.nativeElement);
      const fieldName = firstInvalid ? this.validationScrollService.getFieldLabel(firstInvalid) : null;
      const errorType = firstInvalid ? this.validationScrollService.getFieldErrorType(firstInvalid) : null;
      this.validationScrollService.scrollToFirstInvalidSoon(this.hostRef);
      // Сообщение с названием поля и типом ошибки (инкрементальная миграция): конкретные тексты постепенно уедут в inline-ошибки.
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
      const errorMessage = (e as Error).message || e.toString();
      // Пытаемся найти соответствующий элемент в DOM по тексту ошибки
      const targetElement = this.findElementByErrorText(errorMessage);
      if (targetElement) {
        this.validationScrollService.scrollToElement(targetElement);
      } else {
        this.validationScrollService.scrollToFirstInvalidSoon(this.hostRef);
      }
      // Извлекаем название поля из текста ошибки для более понятного сообщения
      const fieldName = this.extractFieldNameFromError(errorMessage);
      if (fieldName) {
        // Проверяем, содержит ли сообщение название поля
        const lowerError = errorMessage.toLowerCase();
        const lowerFieldName = fieldName.toLowerCase();
        const fieldNameInMessage = lowerFieldName.split(' ').some(word => 
          word.length > 3 && lowerError.includes(word)
        );
        
        if (fieldNameInMessage) {
          // Если название поля уже в сообщении, показываем как есть
          this.toasty?.warn?.(errorMessage);
        } else {
          // Если нет, добавляем название поля
          this.toasty?.warn?.(`Заполните обязательное поле "${fieldName}". ${errorMessage}`);
        }
        // Не пробрасываем ошибку дальше, чтобы избежать дублирования
        return;
      }
      // Если не нашли название поля, пробрасываем ошибку дальше (CustomErrorHandler покажет её)
      throw e;
    }
  }


  private getExpertReviewType(): string | undefined {
    // Проект может приходить частично загруженным или ошибочно переданным (например, signal вместо значения).
    // В проде лучше деградировать без падения UI.
    return this._project?.code?.expertReviewType;
  }

  isOldReviewType() {
    const type = this.getExpertReviewType();
    // Консервативное поведение: если тип неизвестен, считаем форму "старой", чтобы не требовать доп. выбора направлений.
    if (!type) return true;
    return !type.endsWith('_NEW');
  }

  canHasSocialEconomicGoals() {
    return this._project?.code?.code === '8.13';
  }

  needSelectDirections() {
    const type = this.getExpertReviewType();
    if (!type) return false;
    return !this.isOldReviewType()
      && type !== TemplateType.EXPERT_REVIEW_8_10PVT_NEW
      && type !== TemplateType.EXPERT_REVIEW_8_10PIT_NEW;
  }

  /**
   * Находит элемент в DOM по тексту ошибки валидации
   */
  private findElementByErrorText(errorMessage: string): HTMLElement | null {
    const root = this.hostRef?.nativeElement;
    if (!root) return null;

    const lowerError = errorMessage.toLowerCase();

    // Маппинг текстов ошибок на селекторы или ключевые слова для поиска
    const errorMappings: { [key: string]: string } = {
      'количество часов': 'input[title*="часов"], input[placeholder*="Часы"]',
      'часов': 'input[title*="часов"], input[placeholder*="Часы"]'
    };

    for (const [keyword, selector] of Object.entries(errorMappings)) {
      if (lowerError.includes(keyword)) {
        // Ищем элемент по селектору
        const element = root.querySelector<HTMLElement>(selector);
        if (element && this.validationScrollService.isElementVisible(element)) {
          return element;
        }
        // Если прямой селектор не сработал, ищем по label
        const labels = Array.from(root.querySelectorAll<HTMLLabelElement>('label'));
        for (const label of labels) {
          const labelText = label.textContent?.toLowerCase() || '';
          if (labelText.includes(keyword)) {
            // Находим родительский form-group и ищем в нём input
            const formGroup = label.closest('.form-group');
            if (formGroup) {
              const input = formGroup.querySelector<HTMLElement>('input[type="text"], input:not([type])');
              if (input && this.validationScrollService.isElementVisible(input)) {
                return input;
              }
            }
            return label;
          }
        }
      }
    }

    return null;
  }

  /**
   * Извлекает название поля из текста ошибки или находит его в DOM
   */
  private extractFieldNameFromError(errorMessage: string): string | null {
    const root = this.hostRef?.nativeElement;
    if (!root) return null;

    const lowerError = errorMessage.toLowerCase();

    // Маппинг текстов ошибок на ключевые слова для поиска в DOM
    const errorMappings: { [key: string]: string } = {
      'количество часов': 'количество часов',
      'часов': 'часов'
    };

    for (const [keyword, searchKeyword] of Object.entries(errorMappings)) {
      if (lowerError.includes(keyword)) {
        // Пытаемся найти точное название в DOM
        const labels = Array.from(root.querySelectorAll<HTMLLabelElement>('label'));
        for (const label of labels) {
          const labelText = label.textContent?.trim() || '';
          const lowerLabelText = labelText.toLowerCase();
          // Проверяем, содержит ли label ключевое слово
          if (lowerLabelText.includes(searchKeyword)) {
            // Ограничиваем длину для читаемости
            if (labelText.length > 100) {
              return labelText.substring(0, 97) + '...';
            }
            return labelText;
          }
        }
      }
    }

    return null;
  }
}
