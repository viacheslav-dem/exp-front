import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-innovative-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Возможность отнесения товаров (работ, услуг) к категории инновационных:
      </label>
      <app-boolean-button
        name="innovative"
        required
        [(ngModel)]="_form().innovative"
        [trueLabel]="'возможно'"
        [falseLabel]="'невозможно'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().innovativeText" name="innovativeText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class InnovativeBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    innovative: boolean;
    innovativeText: string;
}>(undefined);

  readonly onConditionsChanged = output<boolean>();
}
