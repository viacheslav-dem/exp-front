import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-competence-sufficiency-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Достаточность компетенции кадрового состава потенциального исполнителя работ:
      </label>
      <app-dropdown name="competenceSufficiency" required [options]="competenceSufficiencyOptions" [(ngModel)]="_form().competenceSufficiency"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().competenceSufficiencyText"
          [attr.name]="'competenceSufficiencyText_' + num().split('.').join('_')"
          required
          minlength="30"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
      @if (full()) {
        <div class="hint">
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
      }
    </div>
    `,
    standalone: false
})
export class CompetenceSufficiencyBlockComponent {

  competenceSufficiencyOptions = competenceSufficiencyOptions;

  readonly num = input<string>("4");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    competenceSufficiency: string;
    competenceSufficiencyText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}

export const competenceSufficiencyOptions: string[] = [
  'достаточна',
  'недостаточна',
];
