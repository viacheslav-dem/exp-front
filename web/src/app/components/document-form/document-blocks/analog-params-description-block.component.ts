import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-analog-params-description-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Признаки, которыми технологии и (или) продукция отличаются от аналогов на
        территории Республики Беларусь и (или) в мире.
      </label>
      <textarea [(ngModel)]="_form.analogParamsText" rows="3" class="form-control"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Перечислите признаки, по которым наиболее близкий аналог
          в Республике Беларусь отличается от объекта государственной экспертизы.
        </p>
        <p>
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
           Если информация отсутствует, дайте свою экспертную оценку по данному вопросу.
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class AnalogParamsDescriptionBlockComponent {

  @Input()
  num: string = "5.4";

  @Input()
  full: boolean = true;

  @Input()
  _form: { analogParamsText: string };
}
