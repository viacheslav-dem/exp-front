import {Directive, ElementRef, forwardRef, HostListener} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";

export const NI_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BankAccountInputDirective),
  multi: true
};

@Directive({
    selector: 'input[accountInput]',
    providers: [NI_CONTROL_VALUE_ACCESSOR],
    standalone: false
})
export class BankAccountInputDirective extends ControlComponent<string> {
  private regex: RegExp = new RegExp(/^BY[0-9]{0,2}$|^BY[0-9]{0,2}AKBB(([0-9]{0,4}){0,4})[0-9]{0,4}$/g);
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
    let current: string = this.elem.value.replace(/\s/g, "");
    if (!current || !String(current).match(this.regex)) {
      if (this.value == null || current == 'B') {
        this.value = 'BY';
      }
      if (this.value.length == 2 && current == "B") {
        this.value = null;
      }
      if (current.length == 1 && (+current) > 0) {
        this.value = 'BY' + current;
      }
      if (current.length == 5 && (+(current.slice(4, 5)) > 0)) {
        let str = current.slice(0, 4);
        this.value = str + ' AKBB ' + current.slice(4, 5);
      }
      if (current.length == 7) {
        this.value = current.slice(0, 4);
      }
      this.prepareValue();
    }
    else {
      if (current.length == 4) {
        current += 'AKBB ';
      }
      if (current.length == 8) {
        current = current.slice(0, -4);
      }
      this.value = current.replace(/(\w{4})/g, function (match) {
        return match + " ";
      }).trim();
      this.prepareValue();
    }
  }
}
