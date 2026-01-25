import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-conclusion-block',
    template: `
    <div class="form-group">

      <label class="font-weight-bold">
        Заключение эксперта по объекту государственной экспертизы 
      </label>
        <br\>
      <input type="hidden" [ngModel]="_form()?.conclusion" name="conclusion" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button [disabled]=disabled() type="button" class="btn btn-outline-success" [ngClass]="{'active': _form()?.conclusion === true}" (click)="stateButton(true)">
          Положительное
        </button>
        <button [disabled]=disabled() type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form()?.conclusion === false && _form()?.conclusion !== undefined}" (click)="stateButton(false)">
          Отрицательное
        </button>
      </div>
      <textarea
        [ngModel]="_form()?.conclusionText"
        (ngModelChange)="emitPatch({ conclusionText: $event })"
        [attr.name]="'conclusionText'"
        required
        minlength="30"
        maxlength="5000"
        rows="3"
        class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)."
      ></textarea>
      <div *ngIf="financeConclusionNum()" class="hint">
        <p>
          <b>Подсказка.</b>
          Положительное решение принимается, если в подпункте {{financeConclusionNum()}} имеется оценка «целесообразно».
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class ConclusionBlockComponent {

  readonly disabled = input<boolean>(false);

  readonly financeConclusionNum = input<string>(undefined);

  readonly _form = input<ConclusionBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<ConclusionBlockForm>>();

  emitPatch(patch: Partial<ConclusionBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }

  stateButton(flag: boolean) {
    this.emitPatch({ conclusion: flag });
  }
}

type ConclusionBlockForm = {
  conclusion: boolean;
  conclusionText: string;
};
