import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-consequences-conclusion-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка возможных социальных, экономических и экологических последствий внедрения выбранных технологий
        и необходимости модернизации (реконструкции) взаимосвязанных действующих производственных объектов:
      </label>
      <app-boolean-button name="consequences" required [ngModel]="_form()?.consequences" [trueLabel]="'значительные'"
        [falseLabel]="'незначительные'"
      (ngModelChange)="emitPatch({ consequences: $event })"></app-boolean-button>
      @if (full()) {
        <textarea [ngModel]="_form()?.consequencesText" (ngModelChange)="emitPatch({ consequencesText: $event })" name="consequencesText" rows="3" class="form-control mt-05"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
          </p>
          <p class="mb-0">Оцените:</p>
          <ul>
            <li>
              возможные позитивные и (или) негативные последствия в социальной и экономической
              сферах при внедрении предлагаемой в рамках реализации инвестиционного проекта технологии;
            </li>
            <li>
              влияние создаваемого объекта на экологию, в том числе в рамках конкретной местности,
              с указанием соответствующих видов и величин, результатов и затрат;
            </li>
            <li>
              систему менеджмента организации, его потенциальные возможности по осуществлению инвестиционного
              проекта, а также эксплуатацию объекта с учетом кадрового потенциала;
            </li>
            <li>
              обоснованность необходимости модернизации (реконструкции) взаимосвязанных
              действующих производственных объектов.
            </li>
          </ul>
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
export class ConsequencesConclusionBlockComponent {

  readonly num = input<string>("3");

  readonly full = input<boolean>(true);

  readonly _form = input<ConsequencesConclusionBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<ConsequencesConclusionBlockForm>>();

  emitPatch(patch: Partial<ConsequencesConclusionBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type ConsequencesConclusionBlockForm = {
  consequences: boolean;
  consequencesText: string;
};
