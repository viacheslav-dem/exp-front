import {Component, forwardRef, Input} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

export const BB_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BooleanButtonV2Component),
    multi: true
};
@Component({
    selector: 'app-boolean-button-v2',
    template: `
        <div [class.disabled]="disabled" (click)="toggle()" style="display: inline-block; height:30px;" class="mr-2">
            <label  (click)="toggle1()" [class]="'btn btn-sm ' + trueStyle" [class.active]="_value" [class.disabled]="disabled">
                <fa-icon *ngIf="_value && (!disabled || showDisabledSelection)" icon="check"></fa-icon>
                {{label1}}
            </label>
            <label (click)="toggle2()" [class]="'btn btn-sm ' + falseStyle" [class.active]="!_value" [class.disabled]="disabled">
                <fa-icon *ngIf="!_value && (!disabled || showDisabledSelection)" icon="check"></fa-icon>
                {{label2}}
            </label>
            <label (click)="toggle3()" [class]="'btn btn-sm ' + averageStyle" [class.active]="!_value" [class.disabled]="disabled">
                <fa-icon *ngIf="!_value && (!disabled || showDisabledSelection)" icon="check"></fa-icon>
                {{label3}}
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
    }
    label:last-child {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }
  `],
    providers: [BB_CONTROL_VALUE_ACCESSOR]
})
export class BooleanButtonV2Component extends ControlComponent<boolean> {

    @Input()
    label1:string = 'Да';

    @Input()
    label2:string = 'Нет';

    @Input()
    label3:string = 'Нет';

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
    @Input()
    averageStyle:string = 'btn-primary';

    constructor() { super(); }

    ngOnInit() {
        switch (this.type){
            case 'ONOFF':
                this.trueStyle = 'btn-success';
                this.falseStyle = 'btn-danger';
                this.averageStyle = 'btn-warning';
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