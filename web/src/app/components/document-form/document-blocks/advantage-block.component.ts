import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-advantage-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Обладание товаром более высокими технико-экономическими показателями по сравнению с другими товарами, 
        представленными на определенном сегменте рынка:
      </label>
      <app-boolean-button [(ngModel)]="_form.advantage" [trueLabel]="'да'"
                          [falseLabel]="'нет'" 
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.advantageText" rows="3" class="form-control mt-05"
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
export class AdvantageBlockComponent {

  @Input()
  num: string = "2";

  @Input()
  full: boolean = true;

  @Input()
  _form: { advantage: boolean, advantageText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
