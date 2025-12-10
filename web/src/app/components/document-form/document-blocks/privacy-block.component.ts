import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-privacy-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Создание объекта права промышленной собственности
        при реализации объекта государственной экспертизы:
      </label>
      <app-dropdown [options]="privacyOptions" [(ngModel)]="_form.privacyObjectsDescription"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full || _form.privacyObjectsDescription == 'предусматривается'" 
                [(ngModel)]="_form.privacyObjectsDescriptionText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Укажите объекты права промышленной собственности, создание которых предусматривается объектом
          государственной экспертизы.
        </p>
        <p>
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          или сделайте пометку "не представлено в материалах по объекту государственной экспертизы". Если информация отсутствует, дайте свою экспертную оценку по данному вопросу.
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class PrivacyBlockComponent {

  privacyOptions: string[] = [
    'предусматривается',
    'не предусматривается',
  ];

  @Input()
  num: string = "7";

  @Input()
  full: boolean = true;

  @Input()
  _form: { privacyObjectsDescription: string, privacyObjectsDescriptionText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
