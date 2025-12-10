import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-effect-conclusion-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Возможный экономический и (или) социальный и (или) экологический эффект от реализации мероприятия:
      </label>
      <app-boolean-button
        [(ngModel)]="_form.effect"
        [trueLabel]="'присутствует'"
        [falseLabel]="'отсутствует'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.effectText" rows="3" class="form-control"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `,
    standalone: false
})
export class EffectConclusionBlockComponent {

  @Input()
  num: string = "3";

  @Input()
  full: boolean = true;

  @Input()
  _form: {
    effect: boolean;
    effectText;
  };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
