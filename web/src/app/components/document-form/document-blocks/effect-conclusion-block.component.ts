import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-effect-conclusion-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Возможный экономический и (или) социальный и (или) экологический эффект от реализации мероприятия:
      </label>
      <app-boolean-button
        name="effect"
        required
        [(ngModel)]="_form().effect"
        [trueLabel]="'присутствует'"
        [falseLabel]="'отсутствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().effectText" name="effectText" required minlength="30" rows="3" class="form-control"
        placeholder="Обязательный текст (не менее 30 символов)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class EffectConclusionBlockComponent {

  readonly num = input<string>("3");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    effect: boolean;
    effectText;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
