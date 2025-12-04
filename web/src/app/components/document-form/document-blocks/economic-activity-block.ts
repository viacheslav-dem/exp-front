import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-economic-activity-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие товара перечню кодов продукции по видам экономической деятельности согласно приложению к Положению:
      </label>
      <app-boolean-button [(ngModel)]="_form().economicActivity" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full() || _form().economicActivity) {
        <textarea
          [(ngModel)]="_form().economicActivityText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class EconomicActivityBlockComponent {

    readonly num = input<string>("9.1");

    readonly full = input<boolean>(true);
    readonly _form = input<{
    economicActivity: boolean;
    economicActivityText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
