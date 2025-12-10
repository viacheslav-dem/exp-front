import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-patents-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Создание товара с использованием способных к правовой охране результатов интеллектуальной деятельности
        (изобретений, полезных моделей, промышленных образцов, топологий интегральных микросхем, сортов растений, 
        на которые в установленном порядке получены патенты (свидетельства) либо приняты решения патентного органа об их выдаче):
      </label>
      <app-boolean-button [(ngModel)]="_form.patents" [trueLabel]="'да'"
                          [falseLabel]="'нет'" 
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.patentsText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Проведите анализ и оценку соответствия объекта экспертизы критерию.
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class PatentsBlockComponent {

  @Input()
  num: string = "1";

  @Input()
  full: boolean = true;

  @Input()
  _form: { patents: boolean, patentsText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
