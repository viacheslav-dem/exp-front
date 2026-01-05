import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-needs-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Обоснование прогнозируемой потребности в разрабатываемой продукции (товарах, услугах)
        внутри страны (возможно по сферам экономики, регионам республики, сведения об основных потребителях),
        в рамках Евразийского экономического союза и дальнего зарубежья:
      </label>
      <app-dropdown name="needs" required [options]="needsOptions" [(ngModel)]="_form().needs"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().needsText"
          [attr.name]="'needsText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
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
export class NeedsBlockComponent {

  needsOptions: string[] = [
    'имеется',
    'не имеется',
  ];

  readonly num = input<string>("5.4");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    needs: string;
    needsText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
