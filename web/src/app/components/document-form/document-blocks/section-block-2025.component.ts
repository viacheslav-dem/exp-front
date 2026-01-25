import {Component, input, output} from "@angular/core";
import {IndustryDto} from "@app/dto/IndustryDto";
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-section-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Секция и подсекция основного вида экономической деятельности, которому соответствует
        планируемый к реализации инновационный проект:
      </label>
      <app-select-catalog
        name="section"
        [catalog]="Catalog.INDUSTRY"
        [optionToString]="sectionToString"
        required
        [ngModel]="_form()?.section"
        (ngModelChange)="emitPatch({ section: $event })"
      ></app-select-catalog>
      @if (full()) {
        <div class="hint">
          <p>
            Пороговое значение валовой добавленной стоимости в расчете на одного занятого
            по основным видам экономической деятельности в Европейском союзе: <b>{{_form()?.section?.addedValueBound || '-'}}</b> евро.
          </p>
        </div>
      }
      <textarea
        [ngModel]="_form()?.sectionText"
        (ngModelChange)="emitPatch({ sectionText: $event })"
        [name]="'sectionText_' + num().split('.').join('_')"
        required
        minlength="30"
        rows="3"
        class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)."
      ></textarea>
      <div class="hint">
        <p>
          <b>Подсказка.</b>
          Эксперт должен указать пороговое значение валовой добавленной стоимости в соответствии с приложением к Методическим рекомендациям
          о порядке расчета и оценке соответствия критериям, установленным Указом Президента Республики Беларусь от 7 августа 2012 г. № 357,
          утвержденным постановлением Министерства экономики Республики Беларусь и Государственного комитета по науке и технологиям
          Республики Беларусь от 23 мая 2017 г. № 12/11, по объекту государственной экспертизы с обязательным указанием ссылок на наименования
          документов и номера страниц, в которых приводится соответствующая информация по представленным материалам объекта государственной экспертизы;
          если в материалах по объекту государственной экспертизы отсутствует соответствующая информация,
          эксперт должен указать в данном пункте заключения фразу: «не представлено в материалах по объекту государственной экспертизы»
          и дать свою экспертную оценку по данному вопросу.
        </p>
      </div>
    </div>
    `,
    standalone: false
})
export class SectionBlock2025Component {

    Catalog = Catalog;
    sectionToString = (section: IndustryDto) => section.code + " - " + section.name

    readonly num = input<string>("2.1");

    readonly full = input<boolean>(true);

    readonly _form = input<SectionBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<SectionBlock2025Form>>();

    emitPatch(patch: Partial<SectionBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }
}

type SectionBlock2025Form = {
    section: IndustryDto;
    sectionText: string;
};
