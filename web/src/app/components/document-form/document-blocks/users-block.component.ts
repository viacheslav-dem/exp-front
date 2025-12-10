import {Component, input} from '@angular/core';

@Component({
    selector: 'app-users-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Сведения о предполагаемом владельце, операторе, пользователях программно-технических средств,
        информационных ресурсов, информационных систем и информационных сетей.
      </label>
      <textarea [(ngModel)]="_form().users" rows="3" class="form-control"
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

  readonly _form = input<{
    users: string;
}>(undefined);
}
