import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-title-protection-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Наличие охранного документа на объект права промышленной собственности,
          который применен (содержится, включен) в товаре (работе, услуге), 
          претендующем на отнесение к высокотехнологичному по пункту 5 таблицы «Критерии отнесения товаров к высокотехнологичным»
          приложения 2 к Инструкции о порядке выдачи заключений об отнесении товаров к высокотехнологичным,
          утвержденной постановлением ГКНТ от 25 июля 2022 г. № 12:
      </label>
      <app-boolean-button
        [(ngModel)]="_form.titleProtection"
        [trueLabel]="'да'"
        [falseLabel]="'нет'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.titleProtectionText" rows="3" class="form-control"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `
})
export class TitleProtectionBlockComponent {

    @Input()
    num: string = "5";

    @Input()
    full: boolean = true;

    @Input()
    _form: {
        titleProtection: boolean;
        titleProtectionText: string;
    };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
