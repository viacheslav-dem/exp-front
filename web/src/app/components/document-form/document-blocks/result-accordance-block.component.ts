import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-result-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        @if (num) {
          <span>{{num}}.</span>
        }
        Соответствие достигнутого результата запланированному:
      </label>
      <app-boolean-button [(ngModel)]="_form.accordance" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full) {
        <textarea [(ngModel)]="_form.accordanceText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
      @if (full) {
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

  @Input()
  num: string;

  @Input()
  full: boolean = true;

  @Input()
  _form: { accordance: boolean, accordanceText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
