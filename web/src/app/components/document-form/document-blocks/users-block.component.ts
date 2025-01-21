import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-users-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Сведения о предполагаемом владельце, операторе, пользователях программно-технических средств, 
        информационных ресурсов, информационных систем и информационных сетей.
      </label>
      <textarea [(ngModel)]="_form.users" rows="3" class="form-control"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Укажите необходимые сведения по объекту экспертизы по представленным материалам объекта экспертизы.
        </p>
        <p>
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
        </p>
      </div>
    </div>
  `
})
export class UsersBlockComponent {

  @Input()
  num: string = "5";

  @Input()
  full: boolean = true;

  @Input()
  _form: { users: string };
}
