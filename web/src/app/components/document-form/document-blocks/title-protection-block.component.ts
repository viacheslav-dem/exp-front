import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-title-protection-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Наличие охранного документа на объект права промышленной собственности,
        который применен (содержится, включен) в товаре (работе, услуге),
        претендующем на отнесение к высокотехнологичному по пункту 5 таблицы «Критерии отнесения товаров к высокотехнологичным»
        приложения 2 к Инструкции о порядке выдачи заключений об отнесении товаров к высокотехнологичным,
        утвержденной постановлением ГКНТ от 25 июля 2022 г. № 12:
      </label>
      <app-boolean-button
        [(ngModel)]="_form().titleProtection"
        [trueLabel]="'да'"
        [falseLabel]="'нет'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().titleProtectionText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class TitleProtectionBlockComponent {

    readonly num = input<string>("5");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    titleProtection: boolean;
    titleProtectionText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
