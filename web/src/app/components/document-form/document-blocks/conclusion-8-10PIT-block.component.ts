import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-conclusion-8-10PIT-block',
    template: `
    <div class="form-group">

      <label class="font-weight-bold">
        Заключение эксперта по объекту государственной экспертизы
      </label>

      <label>Отнесение товара (работы, услуги) к категории инновационных товаров:</label>
      <app-boolean-button [ngModel]="_form.patents && _form.advantage && _form.competitiveness"
                          [disabled]="true"
                          [showDisabledSelection]="true"
                          [trueLabel]="'относится'"
                          [falseLabel]="'не относится'"></app-boolean-button>
      <div class="hint">
        <p>
          <b>Подсказка.</b>
          Экспертное заключение считается <b>положительным</b>, если в предыдущих трёх пунктах
          указано <b>"да"</b>, иначе оно считается <b>отрицательным</b>.
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class Conclusion810PITBlockComponent {

  @Input()
  _form: { patents: boolean, advantage: boolean, competitiveness: boolean };
}
