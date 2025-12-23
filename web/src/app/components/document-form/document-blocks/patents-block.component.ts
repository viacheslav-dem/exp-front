import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-patents-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Создание товара с использованием способных к правовой охране результатов интеллектуальной деятельности
        (изобретений, полезных моделей, промышленных образцов, топологий интегральных микросхем, сортов растений,
        на которые в установленном порядке получены патенты (свидетельства) либо приняты решения патентного органа об их выдаче):
      </label>
      <app-boolean-button name="patents" required [(ngModel)]="_form().patents" [trueLabel]="'да'"
        [falseLabel]="'нет'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().patentsText"
          [attr.name]="'patentsText_' + num().split('.').join('_')"
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
            Проведите анализ и оценку соответствия объекта экспертизы критерию.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class PatentsBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    patents: boolean;
    patentsText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
