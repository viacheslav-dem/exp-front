import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-high-tech-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Возможность отнесения товаров (работ, услуг) к категории высокотехнологичных: <br>
        (отнесение товаров (работ, услуг) к высокотехнологичным возможно,
        если в подпункте 5.6 пункта 5 настоящего заключения значение коэффициента технологичности товара (работы, услуги) получено на уровне не менее 50 баллов).
      </label>
      <app-boolean-button
        [(ngModel)]="_form.highTech"
        [trueLabel]="'возможно'"
        [falseLabel]="'невозможно'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.highTechText" rows="3" class="form-control"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `,
    standalone: false
})
export class HighTechBlockComponent {

  @Input()
  num: string = "1";

  @Input()
  full: boolean = true;

  @Input()
  _form: { highTech: boolean, highTechText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
