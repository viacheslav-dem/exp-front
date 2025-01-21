import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-innovative-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Возможность отнесения товаров (работ, услуг) к категории инновационных:
      </label>
      <app-boolean-button
        [(ngModel)]="_form.innovative"
        [trueLabel]="'возможно'"
        [falseLabel]="'невозможно'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.innovativeText" rows="3" class="form-control"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `
})
export class InnovativeBlockComponent {

  @Input()
  num: string = "1";

  @Input()
  full: boolean = true;

  @Input()
  _form: { innovative: boolean, innovativeText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
