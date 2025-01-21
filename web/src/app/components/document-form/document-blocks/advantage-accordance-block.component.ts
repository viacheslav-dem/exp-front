import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-advantage-accordance-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие объекта экспертизы критерию, указанному в абзаце 3 пункта 2 Положения о порядке
        формирования перечня инновационных товаров, утвержденного постановлением Совета Министров Республики Беларусь от
        31 октября 2012 г. № 995 (обладание товаром более высокими технико-экономическими показателями по сравнению с
        другими товарами, представленными на определенном сегменте рынка):
      </label>
      <app-boolean-button
        [(ngModel)]="_form.advantage"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.advantageText" rows="3" class="form-control"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `
})
export class AdvantageAccordanceBlockComponent {

  @Input()
  num: string = "2";

  @Input()
  full: boolean = true;

  @Input()
  _form: {
    advantage: boolean;
    advantageText: string;
  };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
