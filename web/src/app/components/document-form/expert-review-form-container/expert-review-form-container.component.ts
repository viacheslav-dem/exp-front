import {Component, ElementRef, Input, input, ChangeDetectionStrategy, ChangeDetectorRef, ComponentFactoryResolver} from "@angular/core";
import {DocumentFormContainerComponent} from "@app/components/document-form/document-form-container/document-form-container.component";
import {ProjectDto} from "@app/dto/ProjectDto";
import {ExpertReviewFormContent} from "@app/components/document-form/form-model/ExpertReviewFormContent";
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {TemplateType} from "@app/components/document-form/form-model/TemplateType";
import {DraftService} from "@app/components/document-form/draft.service";
import {IdDto} from "@app/dto/IdDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
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
    private readonly toasty: GlobalToastyService
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
    if (this.hasInvalidControls()) {
      const firstInvalid = this.getFirstInvalidElement();
      const fieldName = firstInvalid ? this.getFieldLabel(firstInvalid) : null;
      const errorType = firstInvalid ? this.getFieldErrorType(firstInvalid) : null;
      this.scrollToFirstInvalidSoon();
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
      this.scrollToFirstInvalidSoon();
      throw e;
    }
  }

  private hasInvalidControls(): boolean {
    const root = this.hostRef?.nativeElement;
    if (!root) return false;
    return root.querySelector('.ng-invalid') !== null;
  }

  private getFirstInvalidElement(): HTMLElement | null {
    const root = this.hostRef?.nativeElement;
    if (!root) return null;
    const invalidElements = Array.from(root.querySelectorAll<HTMLElement>('.ng-invalid'));
    return invalidElements.find(el => el !== root && this.isElementVisible(el)) || null;
  }

  private getFieldLabel(element: HTMLElement): string | null {
    // Ищем родительский form-sub-group
    let parent = element.parentElement;
    while (parent && !parent.classList.contains('form-sub-group')) {
      parent = parent.parentElement;
    }
    if (!parent) return null;

    // Ищем первый label внутри form-sub-group
    const label = parent.querySelector<HTMLLabelElement>('label');
    if (!label) return null;

    // Извлекаем текст из label, убирая лишние пробелы и переносы строк
    let labelText = label.textContent?.trim() || '';
    // Ограничиваем длину для читаемости
    if (labelText.length > 100) {
      labelText = labelText.substring(0, 97) + '...';
    }
    return labelText || null;
  }

  private getFieldErrorType(element: HTMLElement): string | null {
    // Проверяем атрибуты элемента напрямую для определения типа ошибки
    // Сначала проверяем minlength (более специфичная ошибка)
    if (element.hasAttribute('minlength')) {
      const minLength = parseInt(element.getAttribute('minlength') || '0');
      const value = (element as HTMLInputElement | HTMLTextAreaElement).value || '';
      if (value.length > 0 && value.length < minLength) {
        return 'minlength';
      }
    }
    // Затем проверяем min для числовых полей
    if (element.hasAttribute('min')) {
      const min = parseFloat(element.getAttribute('min') || '0');
      const value = parseFloat((element as HTMLInputElement).value || '0');
      if (!isNaN(value) && value < min) {
        return 'min';
      }
    }
    // Проверяем required (если поле пустое и имеет required)
    if (element.hasAttribute('required')) {
      const value = (element as HTMLInputElement | HTMLTextAreaElement).value;
      if (!value || value.trim() === '') {
        return 'required';
      }
    }
    return null;
  }

  private scrollToFirstInvalidSoon(): void {
    // Два rAF — чтобы дождаться пересчёта классов/DOM после любых синхронных изменений в validate().
    requestAnimationFrame(() => requestAnimationFrame(() => this.scrollToFirstInvalid()));
  }

  private scrollToFirstInvalid(): void {
    const root = this.hostRef?.nativeElement;
    if (!root) return;

    const invalidElements = Array.from(root.querySelectorAll<HTMLElement>('.ng-invalid'));
    const target = invalidElements.find(el => el !== root && this.isElementVisible(el));
    if (!target) return;

    const focusTarget = this.findFocusable(target) ?? target;

    try {
      focusTarget.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
    } catch {
      // старые браузеры/нестандартные контейнеры скролла — деградируем без падения
      focusTarget.scrollIntoView();
    }

    // Фокус улучшает доступность и подсвечивает поле; preventScroll не обязателен, но снижает "дёргание".
    try {
      (focusTarget as any).focus?.({preventScroll: true});
    } catch {
      try {
        (focusTarget as any).focus?.();
      } catch {
        // ignore
      }
    }
  }

  private findFocusable(el: HTMLElement): HTMLElement | null {
    if (this.isFocusable(el)) return el;
    return el.querySelector<HTMLElement>(
      'input:not([type="hidden"]), textarea, select, button, [tabindex]:not([tabindex="-1"])'
    );
  }

  private isFocusable(el: HTMLElement): boolean {
    const tag = el.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button') return true;
    const tabindex = el.getAttribute('tabindex');
    return tabindex !== null && tabindex !== '-1';
  }

  private isElementVisible(el: HTMLElement): boolean {
    // offsetParent === null -> display:none или hidden в layout (кроме fixed).
    // getClientRects().length === 0 -> element not rendered (например, collapsed/empty).
    if (el.getClientRects().length === 0) return false;
    if (el.offsetParent !== null) return true;
    try {
      return getComputedStyle(el).position === 'fixed';
    } catch {
      return false;
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
}
