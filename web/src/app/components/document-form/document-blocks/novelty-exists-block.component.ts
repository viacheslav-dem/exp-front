import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-novelty-exists-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Создание и внедрение новых технологий и (или) производство новой для Республики Беларусь
        и (или) мировой экономики продукции:
      </label>
      <input type="hidden" [ngModel]="_form()?.noveltyExists" name="noveltyExists" required>
      <app-boolean-button name="noveltyExists" required [ngModel]="_form()?.noveltyExists" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="emitPatch({ noveltyExists: $event })"></app-boolean-button>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.noveltyExistsText"
          (ngModelChange)="emitPatch({ noveltyExistsText: $event })"
          [attr.name]="'noveltyExistsText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
    </div>
    `,
    standalone: false
})
export class NoveltyExistsBlockComponent {

  readonly num = input<string>("1.2");

  readonly full = input<boolean>(true);

  readonly _form = input<NoveltyExistsBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<NoveltyExistsBlockForm>>();

  emitPatch(patch: Partial<NoveltyExistsBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type NoveltyExistsBlockForm = {
  noveltyExists: boolean;
  noveltyExistsText: string;
};
