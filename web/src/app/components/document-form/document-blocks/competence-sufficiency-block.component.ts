import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-competence-sufficiency-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Достаточность компетенции кадрового состава потенциального исполнителя работ:
      </label>
      <app-dropdown [options]="competenceSufficiencyOptions" [(ngModel)]="_form.competenceSufficiency"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.competenceSufficiencyText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Оцените наличие у потенциального исполнителя опыта решения задач,
          владение привлекаемыми специалистами необходимыми техническими
          и маркетинговыми компетенциями для разработки продукта (продукция, услуги, организационно-техническое решение и т.д.)
          и организации его продаж, наличие необходимых для выполнения работ материальных и финансовых ресурсов.
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
export class CompetenceSufficiencyBlockComponent {

  competenceSufficiencyOptions = competenceSufficiencyOptions;

  @Input()
  num: string = "4";

  @Input()
  full: boolean = true;

  @Input()
  _form: { competenceSufficiency: string, competenceSufficiencyText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}

export const competenceSufficiencyOptions: string[] = [
  'достаточна',
  'недостаточна',
];
