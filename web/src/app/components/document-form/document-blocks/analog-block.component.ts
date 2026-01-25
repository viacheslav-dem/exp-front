import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-analog-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Укажите, на что направлен объект государственной экспертизы:
      </label>
      <app-dropdown name="analog" required [options]="analogOptions" [ngModel]="_form()?.analog"
      (ngModelChange)="emitPatch({ analog: $event })"></app-dropdown>
      @if (full()) {
        <textarea [ngModel]="_form()?.analogText" (ngModelChange)="emitPatch({ analogText: $event })" name="analogText" required minlength="30" maxlength="5000" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)"></textarea>
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
export class AnalogBlockComponent {

  analogOptions: string[] = [
    'на создание новшества',
    'на создание полного аналога импортируемой продукции',
  ];

  readonly num = input<string>("5.2");

  readonly full = input<boolean>(true);

  readonly _form = input<AnalogBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<AnalogBlockForm>>();

  emitPatch(patch: Partial<AnalogBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type AnalogBlockForm = {
  analog: string;
  analogText: string;
};
