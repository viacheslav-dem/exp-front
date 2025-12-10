import {Component, forwardRef, Input} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

export const BB_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BooleanButtonComponent),
  multi: true
};
@Component({
    selector: 'app-boolean-button',
    template: `
    <div [class.disabled]="disabled" (click)="toggle()" style="display: inline-block; height:30px;" class="mr-2">
      <label  (click)="toggleTrue()" [class]="'btn btn-sm ' + trueStyle" [class.active]="_value" [class.disabled]="disabled">
        @if (_value && (!disabled || showDisabledSelection)) {
          <fa-icon icon="check"></fa-icon>
        }
        {{trueLabel}}
      </label>
      <label (click)="toggleFalse()" [class]="'btn btn-sm ' + falseStyle" [class.active]="!_value" [class.disabled]="disabled">
        @if (!_value && (!disabled || showDisabledSelection)) {
          <fa-icon icon="check"></fa-icon>
        }
        {{falseLabel}}
      </label>
    </div>
    `,
    styles: [`
    .disabled {
        pointer-events: none;
    }
    label:first-child {
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        margin-left: 0.5rem;
        margin-right: 0.5rem; /* ДОБАВЛЕНО: отступ между кнопками */
    }
    label:last-child {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }
  `],
    providers: [BB_CONTROL_VALUE_ACCESSOR],
    standalone: false
})
export class BooleanButtonComponent extends ControlComponent<boolean> {

  @Input()
  trueLabel:string = 'Да';

  @Input()
  falseLabel:string = 'Нет';

  @Input()
  disabled: boolean = false;

  @Input()
  showDisabledSelection: boolean = false;

  //Допускаются следующие типы: DEFAULT (стоит по-умолчанию), ONOFF
  @Input()
  type:string = 'ONOFF';
  @Input()
  trueStyle:string = 'btn-primary';
  @Input()
  falseStyle:string = 'btn-primary';

  constructor() { super(); }

  ngOnInit() {
    switch (this.type){
      case 'ONOFF':
        this.trueStyle = 'btn-success';
        this.falseStyle = 'btn-danger';
    }
  }

  toggle(){
    this.value = !this.value;
  }

  toggleFalse(){
    if (this.value == false) {
      this.value = !this.value;
    }
  }
  toggleTrue(){
    if (this.value == true) {
      this.value = !this.value;
    }
  }

}
