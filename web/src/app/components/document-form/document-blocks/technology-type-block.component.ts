import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-technology-type-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Использование технологий V или VI технологических укладов:
      </label>
      <div>
        <span>V технологический уклад: </span>
        <app-boolean-button class="d-inline-block"
                            [(ngModel)]="_form.technologyType5"
                            [trueLabel]="'да'"
                            [falseLabel]="'нет'"
                            (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      </div>
      <div>
        <span>VI технологический уклад: </span>
        <app-boolean-button class="d-inline-block"
                            [(ngModel)]="_form.technologyType6"
                            [trueLabel]="'да'"
                            [falseLabel]="'нет'"
                            (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      </div>
      <div>
        <span>проект другого технологического уклада: </span>
        <app-boolean-button class="d-inline-block"
                            [(ngModel)]="_form.technologyOtherType"
                            [trueLabel]="'да'"
                            [falseLabel]="'нет'"
                            (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      </div>
      <textarea *ngIf="full" [(ngModel)]="_form.technologyTypeText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `
})
export class TechnologyTypeBlockComponent {

  @Input()
  num: string = "1.3";

  @Input()
  full: boolean = true;

  @Input()
  _form: { technologyType5: boolean, technologyType6: boolean, technologyOtherType: boolean, technologyTypeText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
