import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-target-accordance-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие объекта государственной экспертизы заявленным целям:
      </label>
      <app-boolean-button [(ngModel)]="_form.targetAccordance" [trueLabel]="'соответствует'"
                          [falseLabel]="'не соответствует'"
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <ng-container *ngIf="!_form.targetAccordance">
        <label>Рекомендуемые цели:</label>
        <textarea [(ngModel)]="_form.targetSuggestion" rows="2" class="form-control"
                  title="Рекомендуемые цели"
                  placeholder="Рекомендуемые цели"></textarea>
      </ng-container>
      <textarea *ngIf="full" [(ngModel)]="_form.targetAccordanceText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
    </div>
  `
})
export class TargetAccordanceBlockComponent {

  @Input()
  num: string = "9.5";

  @Input()
  full: boolean = true;

  @Input()
  _form: { targetAccordance: boolean, targetSuggestion: string, targetAccordanceText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
