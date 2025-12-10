import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-export-orientation-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие (экспортоориентированность) по пункту 3 таблицы «Критерии отнесения товаров к
        высокотехнологичным» приложения 2 к Инструкции о порядке выдачи заключений об отнесении товаров к
        высокотехнологичным, утвержденной постановлением ГКНТ от 25 июля 2022 г. № 12:
      </label>
      <app-boolean-button
        [(ngModel)]="_form().exportOrientation"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().exportOrientationText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class ExportOrientationBlockComponent {

  readonly num = input<string>("4");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    exportOrientation: boolean;
    exportOrientationText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
