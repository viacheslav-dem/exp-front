import {ChangeDetectionStrategy, Component, forwardRef, input} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {environment} from "../../../../environments/environment";

export const BB_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BooleanButtonComponent),
  multi: true
};
@Component({
    selector: 'app-boolean-button',
    template: `
    <div [class.disabled]="disabled()" style="display: inline-block; height:30px;" class="me-2">
      <label (click)="toggleTrue(); $event.stopPropagation()" [class]="'btn btn-sm ' + trueStyle" [class.active]="_value === true" [class.disabled]="disabled()">
        @if (_value === true && (!disabled() || showDisabledSelection())) {
          <fa-icon icon="check"></fa-icon>
        }
        {{trueLabel()}}
      </label>
      <label (click)="toggleFalse(); $event.stopPropagation()" [class]="'btn btn-sm ' + falseStyle" [class.active]="_value === false" [class.disabled]="disabled()">
        @if (_value === false && (!disabled() || showDisabledSelection())) {
          <fa-icon icon="check"></fa-icon>
        }
        {{falseLabel()}}
      </label>
    </div>
    `,
    styleUrls: ['boolean-button.component.scss'],
    providers: [BB_CONTROL_VALUE_ACCESSOR],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.commonControls)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class BooleanButtonComponent extends ControlComponent<boolean> {

  readonly trueLabel = input<string>('Да');

  readonly falseLabel = input<string>('Нет');

  readonly disabled = input<boolean>(false);

  readonly showDisabledSelection = input<boolean>(false);

  //Допускаются следующие типы: DEFAULT (стоит по-умолчанию), ONOFF
  readonly type = input<string>('ONOFF');
  readonly trueStyleInput = input<string>('btn-primary');
  readonly falseStyleInput = input<string>('btn-primary');

  trueStyle: string = 'btn-primary';
  falseStyle: string = 'btn-primary';

  constructor() { super(); }

  override prepareValue(): void {
    // Защита от "грязных" значений из API/черновиков: строковые/числовые boolean.
    // Не трогаем null/undefined (используется как "не выбрано").
    const v: unknown = this._value as unknown;
    if (v === 'true' || v === 1 || v === '1') {
      this._value = true;
    } else if (v === 'false' || v === 0 || v === '0') {
      this._value = false;
    }
  }

  ngOnInit() {
    switch (this.type()){
      case 'ONOFF':
        this.trueStyle = 'btn-success';
        this.falseStyle = 'btn-danger';
        break;
      default:
        this.trueStyle = this.trueStyleInput();
        this.falseStyle = this.falseStyleInput();
    }
  }

  toggle(){
    this.value = !this.value;
  }

  toggleFalse(){
    // Пользовательское действие должно помечать контрол как touched даже если значение не меняется
    this.onTouchedCallbacks.forEach(f => f());
    if (this.value !== false) {
      this.value = false;
    }
  }
  toggleTrue(){
    // Пользовательское действие должно помечать контрол как touched даже если значение не меняется
    this.onTouchedCallbacks.forEach(f => f());
    if (this.value !== true) {
      this.value = true;
    }
  }

}
