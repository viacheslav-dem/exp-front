import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-users-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Сведения о предполагаемом владельце, операторе, пользователях программно-технических средств,
        информационных ресурсов, информационных систем и информационных сетей.
      </label>
      <textarea
        [ngModel]="_form()?.users"
        (ngModelChange)="emitPatch({ users: $event })"
        [attr.name]="'users_' + num().split('.').join('_')"
        required
        maxlength="5000"
        rows="3"
        class="form-control"
      placeholder="Обязательный текст."></textarea>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Укажите необходимые сведения по объекту экспертизы по представленным материалам объекта экспертизы.
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
export class UsersBlockComponent {

  readonly num = input<string>("5");

  readonly full = input<boolean>(true);

  readonly _form = input<UsersBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<UsersBlockForm>>();

  emitPatch(patch: Partial<UsersBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type UsersBlockForm = {
  users: string;
};
