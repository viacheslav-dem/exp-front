import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-novelty-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Новизна (инновационность) объекта государственной экспертизы.
      </label>
      <label>
         Степень новизны (уровень инновационности) объекта государственной экспертизы:
      </label>
      <app-dropdown [options]="noveltyOptions" [(ngModel)]="_form.novelty"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.noveltyText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Сформулируйте, в чем конкретно заключается новизна (инновационность) объекта государственной 
          экспертизы и оцените степень новизны (уровень инновационности) объекта государственной экспертизы.
        </p>
        <p>
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
          Если информация отсутствует, дайте свою экспертную оценку по данному вопросу.
        </p>
      </div>
    </div>
  `
})
export class NoveltyBlockComponent {

  noveltyOptions = noveltyOptions;

  @Input()
  num: string = "1";

  @Input()
  full: boolean = true;

  @Input()
  _form: { novelty: string, noveltyText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}

export const noveltyOptions: string[] = [
  'не является новым для Республики Беларусь',
  'новый для Республики Беларусь',
  'новый для стран СНГ',
  'новизна мирового уровня'
];
