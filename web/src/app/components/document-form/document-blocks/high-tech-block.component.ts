import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-high-tech-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Возможность отнесения товаров (работ, услуг) к категории высокотехнологичных: <br>
        (отнесение товаров (работ, услуг) к высокотехнологичным возможно,
        если в подпункте 5.6 пункта 5 настоящего заключения значение коэффициента технологичности товара (работы, услуги) получено на уровне не менее 50 баллов).
      </label>
      <app-boolean-button
        name="highTech"
        required
        [(ngModel)]="_form().highTech"
        [trueLabel]="'возможно'"
        [falseLabel]="'невозможно'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().highTechText" name="highTechText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class HighTechBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    highTech: boolean;
    highTechText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
