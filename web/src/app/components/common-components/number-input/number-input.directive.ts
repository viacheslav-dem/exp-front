import {Directive, ElementRef, forwardRef, HostListener} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";

export const NI_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberInputDirective),
  multi: true
};

export const NI_CONTROL_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NumberInputDirective),
  multi: true
};

@Directive({
    selector: 'input[numberInput]',
    providers: [NI_CONTROL_VALUE_ACCESSOR, NI_CONTROL_VALIDATORS],
    standalone: false
})
export class NumberInputDirective extends ControlComponent<number> implements Validator
{
  private regex: RegExp = new RegExp(/^-?[0-9]*(\.[0-9]*){0,1}$/g);
  private elem: HTMLInputElement;

  constructor(private el: ElementRef) {
    super();
    this.elem = this.el.nativeElement;
  }

  prepareValue(): void {
    this.elem.value = this._value != null ? this._value.toString() : '';
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let current: string = this.elem.value;
    if (!current || !String(current).match(this.regex)) {
      if (current == '') {
        this.value = null;
      }
      this.prepareValue();
    }
    else {
      this.value = +this.elem.value;
    }
  }

  /**
   * Поддержка template-driven валидации для input[numberInput] с атрибутом min.
   *
   * Почему так: встроенный MinValidator Angular работает только для input[type=number][min],
   * но в проекте числа вводятся как type=text + numberInput (собственный valueAccessor).
   * В результате min="0" раньше не влиял на валидность, и формы были вынуждены делать throw в validate().
   */
  validate(control: AbstractControl): ValidationErrors | null {
    const minAttr = this.elem?.getAttribute?.('min');
    if (minAttr == null || minAttr === '') return null;

    const minValue = Number(minAttr);
    if (Number.isNaN(minValue)) return null;

    const value = control?.value;
    if (value == null || value === '') return null;

    const numeric = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(numeric)) return null;

    return numeric < minValue ? {min: {min: minValue, actual: numeric}} : null;
  }
}
