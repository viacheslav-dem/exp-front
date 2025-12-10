import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-resources-sufficiency-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Достаточность материально-технической базы и кадрового потенциала исполнителя работ:
      </label>
      <app-dropdown [options]="resourcesSufficiencyOptions" [(ngModel)]="_form.resourcesSufficiency"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.resourcesSufficiencyText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Оцените наличие научной, конструкторско-технологической и производственной,
          в том числе лабораторной и опытно- исследовательской базы и метрологического
          обеспечения потенциального исполнителя, кадрового потенциала, включая численность сотрудников,
          привлекаемых для реализации данных работ.
        </p>
        <p>
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class ResourcesSufficiencyBlockComponent {

  resourcesSufficiencyOptions = resourcesSufficiencyOptions;

  @Input()
  num: string = "3";

  @Input()
  full: boolean = true;

  @Input()
  _form: { resourcesSufficiency: string, resourcesSufficiencyText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}

export const resourcesSufficiencyOptions: string[] = [
  'достаточна',
  'недостаточна',
];
