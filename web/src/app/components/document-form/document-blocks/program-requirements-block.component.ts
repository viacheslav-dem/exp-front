import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-program-requirements-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие требованиям, указанным в Положении о порядке реализации государственных программ:
      </label>
      <app-boolean-button [(ngModel)]="_form.programRequirements" [trueLabel]="'соответствует'"
                          [falseLabel]="'не соответствует'" 
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.programRequirementsText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
        </p>
        <p class="mb-0">Укажите соответствие или несоответствие объекта экспертизы требованиям:</p>
        <ul>
          <li>
            <b>для проектов государственных программ</b> – Положения о порядке формирования, финансирования, 
            выполнения и оценки эффективности реализации государственных программ, утвержденном 
            Указом Президента Республики Беларусь от 25 июля 2016 г. № 289 «О порядке формирования, 
            финансирования, выполнения и оценки эффективности реализации государственных программ»;
          </li>
          <li>
            <b>для проектов государственных научно-технических программ</b> – Положения о порядке разработки и выполнения 
            научно-технических программ, утвержденном постановлением Совета Министров Республики Беларусь
            от 31 августа 2005 г. № 961 «Об утверждении Положения о порядке разработки и выполнения
            научно-технических программ и признании утратившими силу некоторых постановлений Совета 
            Министров Республики Беларусь и их отдельных положений».
          </li>
        </ul>
      </div>
    </div>
  `
})
export class ProgramRequirementsBlockComponent {

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
}
