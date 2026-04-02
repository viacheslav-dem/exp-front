import {Directive, HostListener, Input} from '@angular/core';

/**
 * Директива для ограничения ввода только цифрами (0-9).
 * Не заменяет ngModel/ControlValueAccessor — работает поверх них.
 *
 * Использование:
 *   <input type="text" [digitsOnly]="true" [(ngModel)]="value">
 *   <input type="text" [digitsOnly]="field.inputMode === 'numeric'" [(ngModel)]="field.value">
 */
@Directive({
    selector: '[digitsOnly]',
    standalone: false
})
export class DigitsOnlyDirective {

  @Input() digitsOnly: boolean = true;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.digitsOnly) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
         'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (!this.digitsOnly) return;
    const pasted = event.clipboardData?.getData('text/plain') || '';
    if (/[^0-9]/.test(pasted)) {
      event.preventDefault();
      const digitsOnly = pasted.replace(/[^0-9]/g, '');
      if (digitsOnly) {
        document.execCommand('insertText', false, digitsOnly);
      }
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    if (!this.digitsOnly) return;
    const dropped = event.dataTransfer?.getData('text/plain') || '';
    if (/[^0-9]/.test(dropped)) {
      event.preventDefault();
    }
  }
}
