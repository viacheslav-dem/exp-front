import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'app-novelty-exists-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Создание и внедрение новых технологий и (или) производство новой для Республики Беларусь
        и (или) мировой экономики продукции:
      </label>
        <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form.noveltyExists === true}" (click)="stateButton(true)">
                Соответсвует
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form.noveltyExists === false}" (click)="stateButton(false)">
                Не соотвествует
            </button>
        </div>
      <textarea *ngIf="full" [(ngModel)]="_form.noveltyExistsText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
        <div *ngIf="full" class="hint">
            <p>
                <b>Подсказка.</b>
                Эксперт должен сделать вывод о соответствии или о несоответствии с учетом изложенного им в подпунктах 1 – 8.
            </p>
        </div>
    </div>
  `,
    standalone: false
})
export class NoveltyExistsBlock2025Component {

    @Input()
    num: string = "1.2";

    @Input()
    full: boolean = true;

    @Input()
    _form: { noveltyExists: boolean, noveltyExistsText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean) {
        if(flag){
            this._form.noveltyExists = true;
        } else{
            this._form.noveltyExists = false;
        }
    }
}