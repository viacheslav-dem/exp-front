import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-result-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        @if (num()) {
          <span>{{num()}}.</span>
        }
        Соответствие достигнутого результата запланированному:
      </label>
      <app-boolean-button name="accordance" required [(ngModel)]="_form().accordance" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().accordanceText"
          [attr.name]="'accordanceText_' + (num() ? num().split('.').join('_') : 'result')"
          required
          minlength="30"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Если при проведении сопоставительного анализа выявлены несоответствия, то сделайте вывод о несоответствии.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ResultAccordanceBlockComponent {

  readonly num = input<string>(undefined);

  readonly full = input<boolean>(true);

  readonly _form = input<{
    accordance: boolean;
    accordanceText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
