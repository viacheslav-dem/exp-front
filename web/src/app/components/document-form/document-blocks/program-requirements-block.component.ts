import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-program-requirements-block',
    template: `
      <div class="form-sub-group">
        <label>
          {{ num() }}. Соответствие требованиям, указанным в Положении о порядке реализации государственных программ:
        </label>
        <app-boolean-button name="programRequirements" required [(ngModel)]="_form().programRequirements" [trueLabel]="'соответствует'"
          [falseLabel]="'не соответствует'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
        @if (full()) {
          <textarea
            [(ngModel)]="_form().programRequirementsText"
            [attr.name]="'programRequirementsText_' + num().split('.').join('_')"
            required
            minlength="30"
            maxlength="5000"
            rows="3"
            class="form-control mt-05"
          placeholder="Обязательный текст"></textarea>
        }
        @if (full()) {
          <div class="hint">
            <p>
              <b>Подсказка.</b>
            </p>
            <p class="mb-0">Укажите соответствие или несоответствие объекта экспертизы требованиям:</p>
            <ul>
              <li>
                для проектов государственных программ (за исключением государственной программы в сфере цифрового
                развития), в
                рамках которых предусматривается реализация мероприятий в сферах научной, научно-технической и
                инновационной деятельности) –
                Положения о порядке формирования, финансирования, выполнения и оценки эффективности реализации
                государственных программ,
                утвержденного Указом Президента Республики Беларусь от 25 июля 2016 г. № 289;
              </li>
              <li>
                для проектов государственных научно-технических программ – Положения о порядке разработки и
                выполнения
                научно-технических программ, утвержденного постановлением Совета Министров Республики Беларусь от
                31 августа 2005 г. № 961.
              </li>
            </ul>
          </div>
        }
      </div>
      `,
    standalone: false
})
export class ProgramRequirementsBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    programRequirements: boolean;
    programRequirementsText: string;
}>(undefined);

  readonly onConditionsChanged = output<boolean>();
}
