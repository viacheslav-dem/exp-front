import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-novelty-exists-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Создание и внедрение новых технологий и (или) производство новой для Республики Беларусь
        и (или) мировой экономики продукции:
      </label>
      <app-boolean-button name="noveltyExists" required [(ngModel)]="_form().noveltyExists" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().noveltyExistsText"
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

  readonly _form = input<{
    noveltyExists: boolean;
    noveltyExistsText: string;
}>(undefined);

  readonly onConditionsChanged = output<boolean>();
}
