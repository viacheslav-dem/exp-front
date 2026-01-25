import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-needs-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Обоснование прогнозируемой потребности в разрабатываемой продукции (товарах, услугах)
        внутри страны (возможно по сферам экономики, регионам республики, сведения об основных потребителях),
        в рамках Евразийского экономического союза и дальнего зарубежья:
      </label>
      <app-dropdown
        name="needs"
        required
        [options]="needsOptions"
        [ngModel]="_form().needs"
        (ngModelChange)="emitPatch({ needs: $event })"
      ></app-dropdown>
      @if (full()) {
        <textarea
          [ngModel]="_form().needsText"
          (ngModelChange)="emitPatch({ needsText: $event })"
          name="needsText"
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
            в проекте информации о прогнозе социально-экономической эффективности предлагаемого проекта, включающей оценку решения
            важнейших государственных (отраслевых, региональных) проблем, а также расчеты прогнозных показателей эффективности
            от реализации проекта; в том числе сведения о производствах, планируемых к созданию или модернизации в рамках проекта
            (общее количество, наименование производства, планируемая к выпуску продукция на основе предлагаемых инноваций) – <b>имеется / не имеется.</b>
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
export class NeedsBlock2025Component {

    needsOptions: string[] = [
        'имеется',
        'не имеется',
    ];

    readonly num = input<string>("5.4");

    readonly full = input<boolean>(true);

    readonly _form = input<NeedsBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<NeedsBlock2025Form>>();

    emitPatch(patch: Partial<NeedsBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }
}

type NeedsBlock2025Form = {
    needs: string;
    needsText: string;
};