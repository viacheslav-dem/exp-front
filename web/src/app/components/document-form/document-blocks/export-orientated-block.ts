import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-export-orientated-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Экспортная ориентированность товара:
      </label><br>
      <app-boolean-button [(ngModel)]="_form().exportOrientation" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full() || _form().exportOrientation) {
        <textarea
          [(ngModel)]="_form().exportOrientationText"
          [attr.name]="'exportOrientationText_' + num().split('.').join('_')"
          required
          minlength="30"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
    </div>
    `,
    standalone: false
})
export class ExportOrientatedBlockComponent {

    readonly num = input<string>("9.3");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    exportOrientation: boolean;
    exportOrientationText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
