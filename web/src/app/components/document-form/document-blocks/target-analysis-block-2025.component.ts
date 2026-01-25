import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-target-analysis-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Анализ целевых показателей:
      </label>
      <input type="hidden" [ngModel]="_form().targetAnalysis" name="targetAnalysis" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().targetAnalysis === true}" (click)="stateButton(true)">
          Достаточны
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().targetAnalysis === false}" (click)="stateButton(false)">
          Недостаточны
        </button>
      </div>
      @if (full()) {
        <textarea
          [ngModel]="_form().targetAnalysisText"
          (ngModelChange)="emitPatch({ targetAnalysisText: $event })"
          name="targetAnalysisText"
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
            Эксперт:
          </p>
          <ul>
            <li>
              -  выполняет анализ целевых показателей, установленных в объекте экспертизы, оценивает их обоснованность, соответствие целям
              программы, значения;
            </li>
            <li>
              - делает вывод о достаточности / недостаточности перечня целевых показателей и их значений, установленных объектом
              экспертизы, для научно-технического обеспечения решения наиболее значимых народнохозяйственных, экологических, социальных и иных
              проблем Республики Беларусь.
            </li>
          </ul>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class TargetAnalysisBlock2025Component {

    readonly num = input<string>("3");

    readonly full = input<boolean>(true);

    readonly _form = input<TargetAnalysisBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<TargetAnalysisBlock2025Form>>();

    emitPatch(patch: Partial<TargetAnalysisBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    stateButton(flag: boolean) {
        this.emitPatch({ targetAnalysis: flag });
    }
}

type TargetAnalysisBlock2025Form = {
    targetAnalysis: boolean;
    targetAnalysisText: string;
};