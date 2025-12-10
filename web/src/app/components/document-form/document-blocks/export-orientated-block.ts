import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-export-orientated-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Экспортная ориентированность товара:
      </label><br>
      <app-boolean-button [(ngModel)]="_form.exportOrientation" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full || _form.exportOrientation) {
        <textarea
          [(ngModel)]="_form.exportOrientationText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class ExportOrientatedBlockComponent {

    @Input()
    num: string = "9.3";

    @Input()
    full: boolean = true;

    @Input()
    _form: { exportOrientation: boolean, exportOrientationText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
