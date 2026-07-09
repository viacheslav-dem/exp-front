import {ChangeDetectionStrategy, Component, forwardRef, input} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {environment} from "../../../../environments/environment";

export const BB_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BooleanButtonV2Component),
    multi: true
};
@Component({
    selector: 'app-boolean-button-v2',
    template: `
        <div [class.disabled]="disabled()" (click)="toggle()" style="display: inline-block; height:30px;" class="me-2">
          <label  (click)="toggle1()" [class]="'btn btn-sm ' + trueStyle" [class.active]="_value" [class.disabled]="disabled()">
            @if (_value && (!disabled() || showDisabledSelection())) {
              <fa-icon icon="check"></fa-icon>
            }
            {{label1()}}
          </label>
          <label (click)="toggle2()" [class]="'btn btn-sm ' + falseStyle" [class.active]="!_value" [class.disabled]="disabled()">
            @if (!_value && (!disabled() || showDisabledSelection())) {
              <fa-icon icon="check"></fa-icon>
            }
            {{label2()}}
          </label>
          <label (click)="toggle3()" [class]="'btn btn-sm ' + averageStyle" [class.active]="!_value" [class.disabled]="disabled()">
            @if (!_value && (!disabled() || showDisabledSelection())) {
              <fa-icon icon="check"></fa-icon>
            }
            {{label3()}}
          </label>
        </div>
        `,
    styleUrls: ['boolean-button-v2.component.scss'],
    providers: [BB_CONTROL_VALUE_ACCESSOR],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.commonControls)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class BooleanButtonV2Component extends ControlComponent<boolean> {

    readonly label1 = input<string>('Да');

    readonly label2 = input<string>('Нет');

    readonly label3 = input<string>('Нет');

    readonly disabled = input<boolean>(false);

    readonly showDisabledSelection = input<boolean>(false);

    //Допускаются следующие типы: DEFAULT (стоит по-умолчанию), ONOFF
    readonly type = input<string>('ONOFF');
    readonly trueStyleInput = input<string>('btn-primary');
    readonly falseStyleInput = input<string>('btn-primary');
    readonly averageStyleInput = input<string>('btn-primary');

    trueStyle: string = 'btn-primary';
    falseStyle: string = 'btn-primary';
    averageStyle: string = 'btn-primary';

    constructor() { super(); }

    ngOnInit() {
        switch (this.type()){
            case 'ONOFF':
                this.trueStyle = 'btn-success';
                this.falseStyle = 'btn-danger';
                this.averageStyle = 'btn-warning';
                break;
            default:
                this.trueStyle = this.trueStyleInput();
                this.falseStyle = this.falseStyleInput();
                this.averageStyle = this.averageStyleInput();
        }
    }

    toggle(){
        this.value = !this.value;
    }

    toggle2(){
        if (this.value == false) {
            this.value = !this.value;
        }
    }
    toggle1(){
        if (this.value == true) {
            this.value = !this.value;
        }
    }

    toggle3(){
        if (this.value == true) {
            this.value = !this.value;
        }
    }

}