import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-sufficiency-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Достаточность запланированных этапов работ (услуг), 
        создаваемого и приобретаемого программного обеспечения, 
        технических средств и (или) комплексов программно-технических средств для достижения 
        целей государственной программы информатизации (подпрограммы), 
        либо других программ в части мероприятий в сфере информатизации, 
        либо перечня научных исследований и разработок по развитию государственной системы научно-технической 
        информации Республики Беларусь:
      </label>
      <app-boolean-button [(ngModel)]="_form.sufficiency" [trueLabel]="'достаточно'"
                          [falseLabel]="'недостаточно'"
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <ng-container *ngIf="!_form.sufficiency">
        <label>Рекомендуется добавить:</label>
        <textarea
          [(ngModel)]="_form.sufficiencySuggestion" rows="2" class="form-control"           
          title="Рекомендуется добавить"
          placeholder="перечисление ресурсов, которые необходимо добавить в процессе реализации объекта экспертизы"
        ></textarea>
      </ng-container>
      <textarea *ngIf="full" [(ngModel)]="_form.sufficiencyText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
    </div>
  `
})
export class SufficiencyBlockComponent {

  @Input()
  num: string = "4";

  @Input()
  full: boolean = true;

  @Input()
  _form: {
    sufficiency: boolean;
    sufficiencyText: string;
    sufficiencySuggestion: string;
  };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
