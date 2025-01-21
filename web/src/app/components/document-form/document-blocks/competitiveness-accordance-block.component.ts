import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-competitiveness-accordance-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие объекта экспертизы критерию, указанному в абзаце 3 пункта 2 Положения о порядке
        формирования перечня инновационных товаров, утвержденного постановлением Совета Министров Республики Беларусь от
        31 октября 2012 г. № 995 (конкурентоспособность товара):
      </label>
      <app-boolean-button
        [(ngModel)]="_form.competitiveness"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.competitivenessText" rows="3" class="form-control"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `
})
export class CompetitivenessAccordanceBlockComponent {

  @Input()
  num: string = "3";

  @Input()
  full: boolean = true;

  @Input()
  _form: {
    competitiveness: boolean;
    competitivenessText: string;
  };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
