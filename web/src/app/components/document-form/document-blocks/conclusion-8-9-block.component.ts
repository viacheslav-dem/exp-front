import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-conclusion-8-9-block',
  template: `
    <div class="form-group">

      <label class="font-weight-bold">
        Заключение эксперта по объекту государственной экспертизы
      </label>
      
      <label>Целесообразность реализации внедряемых технологий с учетом их оптимальности и инновационности:</label>

      <app-boolean-button
        [(ngModel)]="_form.conclusion"
        [trueLabel]="'целесообразно'"
        [falseLabel]="'нецелесообразно'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea [(ngModel)]="_form.conclusionText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
      <div class="hint">
        <p>
          <b>Подсказка.</b>
          Сделайте однозначный вывод о научно-техническом уровне технологии, целесообразности, 
          эффективности и возможности реализации инвестиционного проекта с учетом оптимальности выбранной технологии 
          и ее инновационности, возможных социальных, экономических и экологических последствиях ее внедрения, 
          предложения по условиям реализации инвестиционного проекта.
        </p>
        <p>          
          В случае указания целесообразности экспертное заключение считается <b>положительным</b>,
          а в случае указания нецелесообразности – <b>отрицательным</b>.
        </p>
      </div>
    </div>
  `
})
export class Conclusion_8_9_BlockComponent {

  @Input()
  _form: { conclusion: boolean, conclusionText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
