import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-target-analysis-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Анализ целевых показателей:
      </label>
      <input type="hidden" [ngModel]="_form()?.targetAnalysis" name="targetAnalysis" required>
      <app-boolean-button name="targetAnalysis" required [ngModel]="_form()?.targetAnalysis" [trueLabel]="'достаточны'"
        [falseLabel]="'недостаточны'"
      (ngModelChange)="emitPatch({ targetAnalysis: $event })"></app-boolean-button>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.targetAnalysisText"
          (ngModelChange)="emitPatch({ targetAnalysisText: $event })"
          [attr.name]="'targetAnalysisText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Выполните анализ целевых показателей, установленных в объекте экспертизы, оцените их обоснованность,
            соответствие целям программы, значение.
          </p>
          <p>
            Сделайте вывод о <b>достаточности</b> / <b>недостаточности</b> перечня целевых показателей и их значений,
            установленных объектом экспертизы, для научно-технического обеспечения решения наиболее значимых
            народнохозяйственных, экологических, социальных и иных проблем Республики Беларусь.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class TargetAnalysisBlockComponent {

  readonly num = input<string>("3");

  readonly full = input<boolean>(true);

  readonly _form = input<TargetAnalysisBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<TargetAnalysisBlockForm>>();

  emitPatch(patch: Partial<TargetAnalysisBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type TargetAnalysisBlockForm = {
  targetAnalysis: boolean;
  targetAnalysisText: string;
};
