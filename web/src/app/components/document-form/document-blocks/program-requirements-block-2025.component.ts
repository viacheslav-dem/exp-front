import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'app-program-requirements-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие требованиям, указанным в Положении о порядке формирования, финансирования, выполнения и оценки эффективности 
          реализации государственных программ, утвержденном Указом Президента Республики Беларусь от 25 июля 2016 г. № 289 / Положении
          о порядке разработки и выполнения научно-технических программ, утвержденном постановлением Совета Министров Республики Беларусь
          от 31 августа 2005 г, № 961:
      </label>
        <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form.programRequirements === true}" (click)="stateButton(true)">
                Соответсвует
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form.programRequirements === false}" (click)="stateButton(false)">
                Не соотвествует
            </button>
        </div>
      <textarea *ngIf="full" [(ngModel)]="_form.programRequirementsText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
        </p>
        <p class="mb-0">Укажите соответствие или несоответствие объекта экспертизы требованиям:</p>
        <ul>
            <li>
                <b>для проектов государственных программ</b>(за исключением государственных программ в сфере цифрового развития), в рамках
                которых предусматривается реализация мероприятий в сферах научной, научно-технической и инновационной деятельности)
                – Положения о порядке формирования, финансирования, выполнения и оценки эффективности реализации государственных программ, утвержденного
                Указом Президента Республики Беларусь от 25 июля 2016 г. № 289;
            </li>
            <li>
                <b>для проектов государственных научно-технических программ</b> – Положения о порядке разработки и выполнения научно-технических
                программ, утвержденного постановлением Совета Министров Республики Беларусь от 31 августа 2005 г. № 961.
            </li>
        </ul>
      </div>
    </div>
  `
})
export class ProgramRequirementsBlock2025Component {

    @Input()
    num: string = "1";

    @Input()
    full: boolean = true;

    @Input()
    _form: {
        programRequirements: boolean;
        programRequirementsText: string;
    };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean) {
        if(flag){
            this._form.programRequirements = true;
        } else {
            this._form.programRequirements = false;
        }
    }

}
