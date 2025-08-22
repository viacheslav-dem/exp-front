import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'app-work-accordance-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие объемов выполняемых работ (оказываемых услуг), включая работы (услуги) по технической поддержке 
          и сопровождению программно-технических средств, информационных ресурсов, информационных систем и информационных сетей, 
          заявленным объемам финансирования:
      </label>
        <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form.workAccordance === true}" (click)="stateButton(true)">
                Соответствует
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form.workAccordance === false}" (click)="stateButton(false)">
                Несоответствует
            </button>
        </div>
      <textarea *ngIf="full" [(ngModel)]="_form.workAccordanceText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
    </div>
  `
})
export class WorkAccordanceBlock2025Component {

    @Input()
    num: string = "7";

    @Input()
    full: boolean = true;

    @Input()
    _form: {
        workAccordance: boolean;
        workAccordanceText: string;
    };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean){
        if(flag){
            this._form.workAccordance = true;
        } else {
            this._form.workAccordance = false;
        }
    }
}