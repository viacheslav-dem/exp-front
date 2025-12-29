import {Component, input} from "@angular/core";

@Component({
    selector: 'app-users-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Сведения о предполагаемом владельце, операторе, пользователях программно-технических средств,
        информационных ресурсов, информационных систем и информационных сетей.
      </label>
      <textarea [(ngModel)]="_form().users" name="users" required minlength="30" maxlength="5000" rows="3" class="form-control"
      placeholder="Обязательный текст (не менее 30 символов)."></textarea>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Эксперт должен указать необходимые сведения по объекту экспертизы по представленным материалам объекта государственной экспертизы.
          </p>
          <p>
            Если в материалах по объекту государственной экспертизы отсутствует данная информация, эксперт должен указать:
            «Не представлено в материалах по объекту государственной экспертизы».
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class UsersBlock2025Component {

    readonly num = input<string>("5");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    users: string;
}>(undefined);
}
