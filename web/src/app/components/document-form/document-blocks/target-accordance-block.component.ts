import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-target-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие объекта государственной экспертизы заявленным целям:
      </label>
      <app-boolean-button [(ngModel)]="_form().targetAccordance" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (!_form().targetAccordance) {
        <label>Рекомендуемые цели:</label>
        <textarea [(ngModel)]="_form().targetSuggestion" rows="2" class="form-control"
          title="Рекомендуемые цели"
        placeholder="Рекомендуемые цели"></textarea>
      }
      @if (full()) {
        <textarea [(ngModel)]="_form().targetAccordanceText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
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

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
