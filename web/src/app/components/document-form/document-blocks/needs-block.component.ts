import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-needs-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Обоснование прогнозируемой потребности в разрабатываемой продукции (товарах, услугах)
        внутри страны (возможно по сферам экономики, регионам республики, сведения об основных потребителях),
        в рамках Евразийского экономического союза и дальнего зарубежья:
      </label>
      <app-dropdown [options]="needsOptions" [(ngModel)]="_form.needs"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full) {
        <textarea [(ngModel)]="_form.needsText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
      @if (full) {
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

  @Input()
  num: string = "5.4";

  @Input()
  full: boolean = true;

  @Input()
  _form: { needs: string, needsText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
