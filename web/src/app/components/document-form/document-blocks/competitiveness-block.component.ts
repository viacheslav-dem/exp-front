import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-competitiveness-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Обоснование конкурентоспособности разработки:
      </label>
      <app-dropdown [options]="competitivenessOptions" [(ngModel)]="_form.competitiveness"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.competitivenessText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class CompetitivenessBlockComponent {

  competitivenessOptions: string[] = [
    'достаточно',
    'недостаточно',
  ];

  @Input()
  num: string = "5.1";

  @Input()
  full: boolean = true;

  @Input()
  _form: { competitiveness: string, competitivenessText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
