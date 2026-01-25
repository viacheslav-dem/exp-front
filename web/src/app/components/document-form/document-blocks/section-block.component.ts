import {Component, input, output} from '@angular/core';
import {IndustryDto} from "@app/dto/IndustryDto";
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-section-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Секция и подсекция основного вида экономической деятельности, которому соответствует
        планируемый к реализации инновационный проект:
      </label>
      <app-select-catalog [catalog]="Catalog.INDUSTRY"
        [optionToString]="sectionToString"
        name="section"
        required
        [ngModel]="_form()?.section"
      (ngModelChange)="emitPatch({ section: $event })"></app-select-catalog>
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
        [attr.name]="'sectionText_' + num().split('.').join('_')"
        required
        minlength="30"
        rows="3"
        class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)."
      ></textarea>
      <div class="hint">
        <p>
          <b>Подсказка.</b>
          Выберите вид экономической деятельности, которому соответствует проект.
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
        </p>
      </div>
    </div>
    `,
    standalone: false
})
export class SectionBlockComponent {

  Catalog = Catalog;
  sectionToString = (section: IndustryDto) => section.code + " - " + section.name

  readonly num = input<string>("2.1");

  readonly full = input<boolean>(true);

  readonly _form = input<SectionBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<SectionBlockForm>>();

  emitPatch(patch: Partial<SectionBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type SectionBlockForm = {
  section: IndustryDto;
  sectionText: string;
};
