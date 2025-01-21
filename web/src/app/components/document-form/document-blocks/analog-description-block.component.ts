import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-analog-description-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Наиболее близкий аналог используемой (выпускаемой) на территории Республики Беларусь
        и (или) в мире технологии и (или) продукции того же назначения:
      </label>
      <input [(ngModel)]="_form.analog" type="text" class="form-control"
             title="Наиболее близкий аналог"
             placeholder="наименование аналога">
      <textarea *ngIf="full" [(ngModel)]="_form.analogText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Укажите наиболее близкий аналог в республике или в мире по объекту государственной экспертизы.
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
export class AnalogDescriptionBlockComponent {

  @Input()
  num: string = "5.3";

  @Input()
  full: boolean = true;

  @Input()
  _form: { analog: string, analogText: string };
}
