import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-effect-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        @if (num) {
          <span>{{num}}.</span>
        }
        Соответствие экономического и (или) социального эффекта установленным условиям коммерциализации:
      </label>
      <app-boolean-button [(ngModel)]="_form.effectAccordance" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full) {
        <textarea [(ngModel)]="_form.effectAccordanceText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
      @if (full) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Если при оценке результатов НТД выявлены несоответствия, то сделайте вывод о несоответствии.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class EffectAccordanceBlockComponent {

  @Input()
  num: string;

  @Input()
  full: boolean = true;

  @Input()
  _form: { effectAccordance: boolean, effectAccordanceText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
