import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-target-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие объекта государственной экспертизы заявленным целям:
      </label>
      <app-boolean-button name="targetAccordance" required [(ngModel)]="_form().targetAccordance" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (!_form().targetAccordance) {
        <label>Рекомендуемые цели:</label>
        <textarea [(ngModel)]="_form().targetSuggestion" name="targetSuggestion" required maxlength="5000" rows="2" class="form-control"
          title="Рекомендуемые цели"
        placeholder="Рекомендуемые цели"></textarea>
      }
      @if (full()) {
        <textarea
          [(ngModel)]="_form().targetAccordanceText"
          [attr.name]="'targetAccordanceText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
    </div>
    `,
    standalone: false
})
export class TargetAccordanceBlockComponent {

  readonly num = input<string>("9.5");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    targetAccordance: boolean;
    targetSuggestion: string;
    targetAccordanceText: string;
}>(undefined);

  readonly onConditionsChanged = output<boolean>();
}
