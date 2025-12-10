import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-technology-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оптимальность выбранной технологии и ее инновационность для Республики Беларусь:
      </label>
      <app-boolean-button [(ngModel)]="_form().technology" [trueLabel]="'подтверждается'"
        [falseLabel]="'не подтверждается'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().technologyText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст."></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Укажите с учётом пунктов 1, 2 данного заключения оптимальность выбранной технологии,
            обоснованность ее внедрения в данной организации и инновационность для Республики Беларусь.
          </p>
          <p>
            Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
            или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class TechnologyBlockComponent {

  readonly num = input<string>("3");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    technology: boolean;
    technologyText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
