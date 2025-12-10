import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-target-analysis-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Анализ целевых показателей:
      </label>
      <app-boolean-button [(ngModel)]="_form.targetAnalysis" [trueLabel]="'достаточны'"
        [falseLabel]="'недостаточны'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full) {
        <textarea [(ngModel)]="_form.targetAnalysisText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
      @if (full) {
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

  @Input()
  num: string = "3";

  @Input()
  full: boolean = true;

  @Input()
  _form: {
    targetAnalysis: boolean;
    targetAnalysisText: string;
  };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
