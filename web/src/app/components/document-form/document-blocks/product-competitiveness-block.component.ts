import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-product-competitiveness-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Конкурентоспособность товара:
      </label>
      <app-boolean-button [(ngModel)]="_form.competitiveness" [trueLabel]="'да'"
                          [falseLabel]="'нет'" 
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.competitivenessText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Проведите анализ и оценку соответствия объекта экспертизы критерию.
        </p>
      </div>
    </div>
  `
})
export class ProductCompetitivenessBlockComponent {

  @Input()
  num: string = "3";

  @Input()
  full: boolean = true;

  @Input()
  _form: { competitiveness: boolean, competitivenessText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
