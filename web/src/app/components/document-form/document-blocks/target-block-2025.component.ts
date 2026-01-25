import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-target-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка целевых показателей проекта:
      </label>
      <app-dropdown
        name="target"
        required
        [options]="targetOptions"
        [ngModel]="_form().target"
        (ngModelChange)="emitPatch({ target: $event })"
      ></app-dropdown>
      @if (full()) {
        <textarea
          [ngModel]="_form().targetText"
          (ngModelChange)="emitPatch({ targetText: $event })"
          name="targetText"
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
            Эксперт должен указать наличие и суть целевых показателей проекта с обязательным указанием ссылок на наименования документов и номера страниц,
            в которых приводится соответствующая информация по представленным материалам объекта государственной экспертизы; если в материалах
            по объекту государственной экспертизы отсутствует соответствующая информация, эксперт должен указать в данном пункте заключения фразу:
            «Не представлено в материалах по объекту государственной экспертизы».
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class TargetBlock2025Component {

    targetOptions: string[] = [
        'достаточна',
        'недостаточна',
    ];

    readonly num = input<string>("3.1");

    readonly full = input<boolean>(true);

    readonly _form = input<TargetBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<TargetBlock2025Form>>();

    emitPatch(patch: Partial<TargetBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }
}

type TargetBlock2025Form = {
    target: string;
    targetText: string;
};
