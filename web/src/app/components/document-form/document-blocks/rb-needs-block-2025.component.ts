import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-rb-needs-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Потребность республики в результатах, получение которых запланировано в ходе реализации мероприятий
        (заданий, проектов, планов, работ, услуг), являющихся объектами государственной экспертизы,
        в том числе с учетом возможностей расширения экспорта и (или) сокращения импорта продукции,
        поставки потребителю разработанной и осваиваемой продукции:
      </label>
      <app-dropdown
        name="rbNeeds"
        required
        [options]="needsOptions"
        [ngModel]="_form().rbNeeds"
        (ngModelChange)="emitPatch({ rbNeeds: $event })"
      ></app-dropdown>
      @if (full()) {
        <textarea
          [ngModel]="_form().rbNeedsText"
          (ngModelChange)="emitPatch({ rbNeedsText: $event })"
          name="rbNeedsText"
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
            Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
            или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class RbNeedsBlock2025Component {

  needsOptions: string[] = [
    'низкая',
    'средняя',
    'высокая'
  ];

  readonly num = input<string>("3");

  readonly full = input<boolean>(true);

  readonly _form = input<RbNeedsBlock2025Form>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<RbNeedsBlock2025Form>>();

  emitPatch(patch: Partial<RbNeedsBlock2025Form>) {
      // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
      this.formPatch.emit(patch);
      // Оставляем событие для обратной совместимости (часть форм привязана к нему).
      this.onConditionsChanged.emit(true);
  }
}

type RbNeedsBlock2025Form = {
    rbNeeds: string;
    rbNeedsText: string;
};
