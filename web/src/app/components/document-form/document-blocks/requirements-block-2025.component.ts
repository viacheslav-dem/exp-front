import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'app-requirements-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Достаточность требований, предъявляемых к квалификации и опыту (компетенции) лиц, привлекаемых для выполнения работ
        (оказания услуг), а также к уровню производственной, научной, конструкторско-технологической базы, необходимой для реализации мероприятия:
      </label>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form.requirements === true}" (click)="stateButton(true)">
          Достаточны
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form.requirements === false}" (click)="stateButton(false)">
          Недостаточны
        </button>
      </div>
      @if (full) {
        <textarea [(ngModel)]="_form.requirementsText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class RequirementsBlock2025Component {

    @Input()
    num: string = "8";

    @Input()
    full: boolean = true;

    @Input()
    _form: {
        requirements: boolean;
        requirementsText: string;
    };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean){
        if(flag){
            this._form.requirements = true;
        } else {
            this._form.requirements = false;
        }
    }
}