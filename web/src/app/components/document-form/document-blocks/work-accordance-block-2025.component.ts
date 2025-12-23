import {Component, EventEmitter, Output, input} from "@angular/core";

@Component({
    selector: 'app-work-accordance-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие объемов выполняемых работ (оказываемых услуг), включая работы (услуги) по технической поддержке
        и сопровождению программно-технических средств, информационных ресурсов, информационных систем и информационных сетей,
        заявленным объемам финансирования:
      </label>
      <input type="hidden" [(ngModel)]="_form().workAccordance" name="workAccordance" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().workAccordance === true}" (click)="stateButton(true)">
          Соответствует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().workAccordance === false}" (click)="stateButton(false)">
          Несоответствует
        </button>
      </div>
      @if (full()) {
        <textarea [(ngModel)]="_form().workAccordanceText" name="workAccordanceText" required minlength="30" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class WorkAccordanceBlock2025Component {

    readonly num = input<string>("7");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    workAccordance: boolean;
    workAccordanceText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean){
        if(flag){
            this._form().workAccordance = true;
        } else {
            this._form().workAccordance = false;
        }
    }
}