import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-resources-sufficiency-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Достаточность материально-технической базы и кадрового потенциала исполнителя работ:
      </label>
      <app-dropdown
        name="resourcesSufficiency"
        required
        [options]="resourcesSufficiencyOptions"
        [ngModel]="_form()?.resourcesSufficiency"
        (ngModelChange)="emitPatch({ resourcesSufficiency: $event })"
      ></app-dropdown>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.resourcesSufficiencyText"
          (ngModelChange)="emitPatch({ resourcesSufficiencyText: $event })"
          [name]="'resourcesSufficiencyText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
      @if (full()) {
        <div class="hint">
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
      }
    </div>
    `,
    standalone: false
})
export class ResourcesSufficiencyBlockComponent {

  resourcesSufficiencyOptions = resourcesSufficiencyOptions;

  readonly num = input<string>("3");

  readonly full = input<boolean>(true);

  readonly _form = input<ResourcesSufficiencyBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<ResourcesSufficiencyBlockForm>>();

  emitPatch(patch: Partial<ResourcesSufficiencyBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type ResourcesSufficiencyBlockForm = {
  resourcesSufficiency: string;
  resourcesSufficiencyText: string;
};

export const resourcesSufficiencyOptions: string[] = [
  'достаточна',
  'недостаточна',
];
