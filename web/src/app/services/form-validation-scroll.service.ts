import { Injectable, ElementRef } from '@angular/core';

/**
 * Сервис для работы с валидацией форм и автоматической прокруткой к невалидным полям.
 * Предоставляет методы для проверки валидности, получения информации о полях и прокрутки к ошибкам.
 */
@Injectable({
  providedIn: 'root'
})
export class FormValidationScrollService {

  /**
   * Проверяет наличие невалидных элементов в форме
   * @param rootElement Корневой элемент формы
   * @returns true, если найдены невалидные элементы
   */
  hasInvalidControls(rootElement: HTMLElement | null): boolean {
    if (!rootElement) return false;
    return rootElement.querySelector('.ng-invalid') !== null;
  }

  /**
   * Находит первый видимый невалидный элемент в форме
   * @param rootElement Корневой элемент формы
   * @returns Первый невалидный элемент или null
   */
  getFirstInvalidElement(rootElement: HTMLElement | null): HTMLElement | null {
    if (!rootElement) return null;
    const invalidElements = Array.from(rootElement.querySelectorAll<HTMLElement>('.ng-invalid'));
    return invalidElements.find(el => el !== rootElement && this.isElementVisible(el)) || null;
  }

  /**
   * Извлекает название поля из связанного label элемента
   * @param element Элемент формы
   * @param labelSelectors Селекторы для поиска label (по умолчанию: 'form-sub-group', 'form-group')
   * @returns Текст label или null
   */
  getFieldLabel(element: HTMLElement, labelSelectors: string[] = ['form-sub-group', 'form-group']): string | null {
    // Ищем родительский контейнер с формой
    let parent = element.parentElement;
    while (parent && !labelSelectors.some(selector => parent!.classList.contains(selector))) {
      parent = parent.parentElement;
    }
    if (!parent) return null;

    // Ищем первый label внутри контейнера
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

  /**
   * Определяет тип ошибки валидации для элемента
   * @param element Элемент формы
   * @returns Тип ошибки: 'required', 'minlength', 'min' или null
   */
  getFieldErrorType(element: HTMLElement): 'required' | 'minlength' | 'min' | null {
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

  /**
   * Прокручивает к первому невалидному элементу с задержкой (использует requestAnimationFrame)
   * @param elementRef ElementRef компонента формы
   */
  scrollToFirstInvalidSoon(elementRef: ElementRef<HTMLElement> | null): void {
    if (!elementRef?.nativeElement) return;
    // Два rAF — чтобы дождаться пересчёта классов/DOM после любых синхронных изменений в validate().
    requestAnimationFrame(() => requestAnimationFrame(() => this.scrollToFirstInvalid(elementRef)));
  }

  /**
   * Прокручивает к первому невалидному элементу и устанавливает на него фокус
   * @param elementRef ElementRef компонента формы
   */
  scrollToFirstInvalid(elementRef: ElementRef<HTMLElement> | null): void {
    const root = elementRef?.nativeElement;
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

  /**
   * Находит фокусируемый элемент внутри контейнера
   * @param el Контейнер элемента
   * @returns Фокусируемый элемент или null
   */
  findFocusable(el: HTMLElement): HTMLElement | null {
    if (this.isFocusable(el)) return el;
    return el.querySelector<HTMLElement>(
      'input:not([type="hidden"]), textarea, select, button, [tabindex]:not([tabindex="-1"])'
    );
  }

  /**
   * Проверяет, является ли элемент фокусируемым
   * @param el Элемент для проверки
   * @returns true, если элемент может получить фокус
   */
  isFocusable(el: HTMLElement): boolean {
    const tag = el.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button') return true;
    const tabindex = el.getAttribute('tabindex');
    return tabindex !== null && tabindex !== '-1';
  }

  /**
   * Проверяет, видим ли элемент на странице
   * @param el Элемент для проверки
   * @returns true, если элемент видим
   */
  isElementVisible(el: HTMLElement): boolean {
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

  /**
   * Прокручивает к указанному элементу и устанавливает на него фокус
   * @param element Элемент для прокрутки
   */
  scrollToElement(element: HTMLElement | null): void {
    if (!element || !this.isElementVisible(element)) return;

    const focusTarget = this.findFocusable(element) ?? element;

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
}

