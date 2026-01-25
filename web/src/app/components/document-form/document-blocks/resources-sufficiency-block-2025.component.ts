import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-resources-sufficiency-block-2025',
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
            Эксперт должен оценить достаточность имеющейся научной, конструкторско-технологической и производственной,
            в том числе лабораторной и опытно-исследовательской базы и метрологического обеспечения исполнителя проекта,
            кадрового потенциала, включая численность сотрудников, привлекаемых для реализации данных работ, обеспеченности
            трудовыми ресурсами соответствующей квалификации, а также наличие необходимых для выполнения работ материальных и
            финансовых ресурсов с обязательным указанием ссылок на наименования документов и номера страниц, в которых приводится
            соответствующая информация по представленным материалам объекта государственной экспертизы; если в материалах по объекту
            государственной экспертизы отсутствует соответствующая информация, эксперт должен указать в данном пункте заключения фразу:
            «Не представлено в материалах по объекту государственной экспертизы».
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ResourcesSufficiencyBlock2025Component {

    resourcesSufficiencyOptions = resourcesSufficiencyOptions;

    readonly num = input<string>("4");

    readonly full = input<boolean>(true);

    readonly _form = input<ResourcesSufficiencyBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<ResourcesSufficiencyBlock2025Form>>();

    emitPatch(patch: Partial<ResourcesSufficiencyBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }
}

type ResourcesSufficiencyBlock2025Form = {
    resourcesSufficiency: string;
    resourcesSufficiencyText: string;
};

export const resourcesSufficiencyOptions: string[] = [
    'достаточна',
    'недостаточна',
];