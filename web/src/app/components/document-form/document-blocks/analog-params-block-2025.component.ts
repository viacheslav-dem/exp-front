import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-analog-params-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Основные технико-экономические и социально-экономические параметры планируемых новшеств
        (аналога импортируемой продукции), анализ аналогов (прототипов) продукции,
        а также возможности использования промежуточных результатов исследований для других разработок (модификаций,
        а также в иных сферах экономики):
      </label>
      <app-dropdown
        name="analogParams"
        required
        [options]="analogParamsOptions"
        [ngModel]="_form().analogParams"
        (ngModelChange)="emitPatch({ analogParams: $event })"
      ></app-dropdown>
      @if (full()) {
        <textarea
          [ngModel]="_form().analogParamsText"
          (ngModelChange)="emitPatch({ analogParamsText: $event })"
          name="analogParamsText"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)"
        ></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Для объектов государственной экспертизы, указанных в подпункте 8.4 пункта 8 Положения, дополнительно проверяется наличие
            в проекте информации об основных социальных и технико-экономических параметрах планируемых новшеств, включающей ориентировочную
            себестоимость и цену новой продукции на момент подачи; себестоимость аналогичной продукции должна быть ниже ее рыночной цены,
            запланированный объем выпуска продукции (общий и по годам) в натуральном и денежном выражении, организации(ях)-изготовителе(ях);
            является ли продукция импортозамещающей и (или) экспортоориентированной; планируется ли в рамках реализации проекта создать
            новое производство или модернизировать действующее с указанием сведений о создаваемом/модернизируемом производстве
            (наименование, мощность и другое) – <b>имеется / не имеется.</b>
          </p>
          <p>
            Если в материалах по объекту государственной экспертизы отсутствует соответствующая информация,
            эксперт должен указать в данном пункте заключения фразу: <b> «Не представлено в материалах по объекту государственной экспертизы».</b>
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class AnalogParamsBlock2025Component {

    analogParamsOptions: string[] = [
        'имеются',
        'не имеются',
    ];

    readonly num = input<string>("5.3");

    readonly full = input<boolean>(true);

    readonly _form = input<AnalogParamsBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<AnalogParamsBlock2025Form>>();

    emitPatch(patch: Partial<AnalogParamsBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }
}

type AnalogParamsBlock2025Form = {
    analogParams: string;
    analogParamsText: string;
};
