import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-import-orientation-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Импортозамещающая ориентированность товара:
      </label><br>
        <app-boolean-button [(ngModel)]="_form.importOrientation" [trueLabel]="'соответствует'"
                            [falseLabel]="'не соответствует'"
                            (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full || _form.importOrientation" 
                [(ngModel)]="_form.importOrientationText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `
})
export class ImportOrientationBlockComponent {

    @Input()
    num: string = "9.4";

    @Input()
    full: boolean = true;

    @Input()
    _form: { importOrientation: boolean, importOrientationText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
