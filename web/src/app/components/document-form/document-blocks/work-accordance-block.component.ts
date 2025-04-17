import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-work-accordance-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие объемов выполняемых работ (оказываемых услуг), 
        включая работы (услуги) по технической поддержке и сопровождению программно-технических средств, 
        информационных ресурсов, информационных систем и информационных сетей, заявленным объемам финансирования:
      </label>
      <app-boolean-button [(ngModel)]="_form.workAccordance" 
                          [trueLabel]="'соответствует'"
                          [falseLabel]="'не соответствует'" 
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.workAccordanceText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
    </div>
  `
})
export class WorkAccordanceBlockComponent {

  @Input()
  num: string = "7";

  @Input()
  full: boolean = true;

  @Input()
  _form: {
    workAccordance: boolean;
    workAccordanceText: string;
  };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
