import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-name-accordance-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие объекта государственной экспертизы своему наименованию:
      </label>
      <app-boolean-button [(ngModel)]="_form.nameAccordance" [trueLabel]="'соответствует'"
                          [falseLabel]="'не соответствует'"
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <ng-container *ngIf="!_form.nameAccordance">
        <label>Рекомендуемое наименование:</label>
        <textarea [(ngModel)]="_form.nameSuggestion" rows="2" class="form-control"
                  title="Рекомендуемое наименование"
                  placeholder="Предлагаемое наименование"></textarea>
      </ng-container>
      <textarea *ngIf="full" [(ngModel)]="_form.nameAccordanceText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `
})
export class NameAccordanceBlockComponent {

  @Input()
  num: string = "9.1";

  @Input()
  full: boolean = true;

  @Input()
  _form: { nameAccordance: boolean, nameSuggestion: string, nameAccordanceText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
