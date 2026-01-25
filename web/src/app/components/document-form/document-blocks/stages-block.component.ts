import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-stages-block',
    template: `
        <div class="form-sub-group">
          <label>
            {{ num() }}. Наличие в календарном плане этапов реализации объекта государственной экспертизы, подлежащих
            государственной
            регистрации в соответствии с законодательством Республики Беларусь:
          </label>
          <app-boolean-button
            name="stages"
            required
            [ngModel]="_form()?.stages"
            [trueLabel]="'имеются'"
            [falseLabel]="'не имеются'"
            (ngModelChange)="emitPatch({ stages: $event })"
          ></app-boolean-button>
          @if (full() || _form()?.stages) {
            <textarea
              [ngModel]="_form()?.stagesText"
              (ngModelChange)="emitPatch({ stagesText: $event })"
              name="stagesText"
              [required]="isTextRequired()"
              [minlength]="isTextRequired() ? 30 : null"
              rows="3"
              class="form-control mt-05"
              [placeholder]="isTextRequired() ? 'Обязательный текст (не менее 30 символов).' : 'Пояснительный текст (при необходимости).'"
            ></textarea>
          }
          @if (full()) {
            <div class="hint">
              <p>
                <b>Подсказка.</b>
                При наличии в календарном плане этапов, подлежащих
                государственной регистрации, перечисляются номера данных этапов.
              </p>
            </div>
          }
        </div>
        `,
    standalone: false
})
export class StagesBlockComponent {

    readonly isTextRequired = input<boolean>(false);

    readonly num = input<string>('9.2');

    readonly full = input<boolean>(true);

    readonly _form = input<StagesBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<StagesBlockForm>>();

    emitPatch(patch: Partial<StagesBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type StagesBlockForm = {
  stages: boolean;
  stagesText: string;
};
