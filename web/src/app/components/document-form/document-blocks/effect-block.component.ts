import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-effect-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Возможный экономический и (или) социальный и (или) экологический эффект от реализации мероприятия.
      </label>
      <textarea [(ngModel)]="_form.effect" rows="3" class="form-control"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Обозначьте возможный эффект по объекту экспертизы по представленным материалам объекта экспертизы.
        </p>
        <p>
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
        </p>
      </div>
    </div>
  `
})
export class EffectBlockComponent {

  @Input()
  num: string = "3";

  @Input()
  full: boolean = true;

  @Input()
  _form: { effect: string };
}
