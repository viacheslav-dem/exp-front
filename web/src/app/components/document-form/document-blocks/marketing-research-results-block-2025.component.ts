import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-marketing-research-results-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Сведения о проведении маркетинговых и патентных исследований и их результаты.
      </label>
      <textarea
        [ngModel]="_form()?.marketingResearchText"
        (ngModelChange)="emitPatch({ marketingResearchText: $event })"
        [name]="'marketingResearchResultsText_' + num().split('.').join('_')"
        required
        minlength="30"
        maxlength="5000"
        rows="3"
        class="form-control"
        placeholder="Обязательный текст (не менее 30 символов)."
      ></textarea>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Эксперт должен оценить наличие конкретных потребителей (возможности переориентации на альтернативные рынки),
            заинтересованных в приобретении создаваемой в результате реализации инвестиционного проекта продукции,
            в количестве, достаточном для обеспечения прогнозируемого уровня использования проектной мощности;
            полноту и качество проведенных маркетинговых исследований рынков сбыта намечаемой к выпуску продукции
            с учетом прогнозируемых тенденций развития этих рынков, обоснованность цен на нее и должен указать
            результаты проведения маркетинговых и патентных исследований по объекту государственной экспертизы
            с обязательным указанием ссылок на наименования документов и номера страниц, в которых приводится
            соответствующая информация по представленным материалам объекта государственной экспертизы; если
            в материалах по объекту государственной экспертизы отсутствует соответствующая информация,
            эксперт должен указать в данном пункте заключения фразу: «не представлено в материалах по объекту
            государственной экспертизы» и дать свою экспертную оценку по данному вопросу).
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class MarketingResearchResultsBlock2025Component {

    readonly num = input<string>("5.1");

    readonly full = input<boolean>(true);

    readonly _form = input<MarketingResearchResultsBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<MarketingResearchResultsBlock2025Form>>();

    emitPatch(patch: Partial<MarketingResearchResultsBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }
}

type MarketingResearchResultsBlock2025Form = {
    marketingResearchText: string;
};