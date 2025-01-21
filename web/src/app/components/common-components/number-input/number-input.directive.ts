import {Directive, ElementRef, forwardRef, HostListener} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";

export const NI_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberInputDirective),
  multi: true
};

@Directive({
  selector: 'input[numberInput]',
  providers: [NI_CONTROL_VALUE_ACCESSOR]
})
export class NumberInputDirective extends ControlComponent<number>
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
}
