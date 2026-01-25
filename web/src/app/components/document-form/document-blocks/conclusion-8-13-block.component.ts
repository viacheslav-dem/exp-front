import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-conclusion-8-13-block',
    template: `
    <div class="form-group">

      <label class="font-weight-bold">
        Заключение эксперта по объекту государственной экспертизы
      </label>

      <label>
        Целесообразность реализации объекта государственной экспертизы:
      </label>
      <input type="hidden" [ngModel]="_form()?.conclusion" name="conclusion" required>
      <app-boolean-button
        name="conclusion"
        required
        [ngModel]="_form()?.conclusion"
        [disabled]="disabled()"
        [showDisabledSelection]="true"
        [trueLabel]="'целесообразно'"
        [falseLabel]="'нецелесообразно'"
        (ngModelChange)="emitPatch({ conclusion: $event })"></app-boolean-button>
      <textarea
        [ngModel]="_form()?.conclusionText"
        (ngModelChange)="emitPatch({ conclusionText: $event })"
        [attr.name]="'conclusionText_8_13'"
        required
        minlength="30"
        maxlength="5000"
        rows="3"
        class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div class="hint">
        <p>
          <b>Подсказка.</b>
          Решение о <b>целесообразности</b> реализации объекта экспертизы принимается только
          при <b>соответствии</b> (<b>достаточности</b>)
          объекта государственной экспертизы всем требованиям выше.
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class Conclusion_8_13_BlockComponent {

  readonly disabled = input<boolean>(false);

  readonly _form = input<Conclusion813BlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<Conclusion813BlockForm>>();

  emitPatch(patch: Partial<Conclusion813BlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type Conclusion813BlockForm = {
  conclusion: boolean;
  conclusionText: string;
};
