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
   * Находит первый невалидный элемент в DOM-порядке без учёта видимости.
   * Используется для сообщения об ошибке, когда все невалидные поля в свёрнутом блоке (напр. пункт повестки).
   */
  getFirstInvalidElementIgnoreVisibility(rootElement: HTMLElement | null): HTMLElement | null {
    if (!rootElement) return null;
    const invalidElements = Array.from(rootElement.querySelectorAll<HTMLElement>('.ng-invalid'));
    return invalidElements.find(el => el !== rootElement) || null;
  }

  /**
   * Извлекает название пункта повестки для элемента (текст подписи заголовка пункта).
   * Поднимается до div.collapse с id="meeting-project-*", берёт предыдущий sibling — app-agenda-header-block, текст label.
   * @param element Элемент внутри секции повестки (напр. невалидный контрол)
   * @returns Текст подписи пункта повестки или null
   */
  getAgendaItemLabel(element: HTMLElement | null): string | null {
    if (!element) return null;
    let parent: HTMLElement | null = element.parentElement;
    while (parent) {
      if (parent.classList.contains('collapse') && parent.id?.startsWith('meeting-project-')) {
        const header = parent.previousElementSibling;
        if (!header) return null;
        const label = header.querySelector<HTMLLabelElement>('label') ?? (header.tagName === 'LABEL' ? header : null);
        if (!label) return null;
        let text = label.textContent?.trim() || '';
        // Убираем суффикс «| Решение: …», чтобы в сообщении об ошибке было только название пункта (например "1. Тест визирования 15 (8.4)")
        const solutionIdx = text.indexOf(' | Решение:');
        if (solutionIdx !== -1) {
          text = text.substring(0, solutionIdx).trim();
        }
        return text || null;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  /**
   * Извлекает название поля из связанного label элемента.
   * Сначала ищется ближайший контейнер с классом form-sub-group, при отсутствии — form-group.
   * @param element Элемент формы (невалидный контрол)
   * @param _labelSelectors Не используется; оставлен для обратной совместимости API
   * @returns Текст первого label в найденном контейнере (без суффикса «| Решение: …») или null
   */
  getFieldLabel(element: HTMLElement, _labelSelectors: string[] = ['form-sub-group', 'form-group']): string | null {
    // Сначала ищем ближайший form-sub-group (подпись конкретного поля), затем form-group
    let parent: HTMLElement | null = element.parentElement;
    let found: HTMLElement | null = null;
    while (parent) {
      if (parent.classList.contains('form-sub-group')) {
        found = parent;
        break;
      }
      parent = parent.parentElement;
    }
    if (!found) {
      parent = element.parentElement;
      while (parent) {
        if (parent.classList.contains('form-group')) {
          found = parent;
          break;
        }
        parent = parent.parentElement;
      }
    }
    if (!found) return null;

    // Ищем первый label внутри контейнера
    const label = found.querySelector<HTMLLabelElement>('label');
    if (!label) return null;

    // Извлекаем текст из label, убирая лишние пробелы и переносы строк
    let labelText = label.textContent?.trim() || '';
    // Убираем суффикс пункта повестки «| Решение: …», чтобы в ошибке было только название поля
    const solutionIdx = labelText.indexOf(' | Решение:');
    if (solutionIdx !== -1) {
      labelText = labelText.substring(0, solutionIdx).trim();
    }
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

