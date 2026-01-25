import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-scientific-level-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка научно-технического уровня внедряемых технологий по сравнению с передовыми технологиями,
        используемыми в мире, и возможности их применения на соответствующем производстве.
      </label>
      <textarea
        [ngModel]="_form()?.scientificLevel"
        (ngModelChange)="emitPatch({ scientificLevel: $event })"
        [name]="'scientificLevel_' + num().split('.').join('_')"
        required
        minlength="30"
        maxlength="5000"
        rows="3"
        class="form-control"
        placeholder="Обязательный текст."
      ></textarea>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            эксперт должен провести оценку научно-технического уровня внедряемых технологий по сравнению с передовыми технологиями для объекта
            государственной экспертизы с обязательным указанием обоснованности выбора технологий и оборудования, исходя из функциональных
            характеристик, конструктивных и объемно-планировочных решений в сравнении с соответствующими аналогами отечественных и зарубежных
            производителей, и ссылок на наименования документов и номера страниц, в которых приводится соответствующая информация по представленным
            материалам объекта государственной экспертизы; если в материалах по объекту государственной экспертизы отсутствует соответствующая
            информация, эксперт должен указать в данном пункте заключения фразу: «не представлено в материалах по объекту государственной
            экспертизы» и дать свою экспертную оценку по данному вопросу
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ScientificLevelBlock2025Component {

    readonly num = input<string>("1.1");

    readonly full = input<boolean>(true);

    readonly _form = input<ScientificLevelBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<ScientificLevelBlock2025Form>>();

    emitPatch(patch: Partial<ScientificLevelBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }
}

type ScientificLevelBlock2025Form = {
    scientificLevel: string;
};