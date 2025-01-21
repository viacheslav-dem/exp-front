import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-marketing-research-results-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Сведения о проведении маркетинговых и патентных исследований и их результаты.
      </label>
      <textarea [(ngModel)]="_form.marketingResearchText" rows="3" class="form-control"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Укажите результаты проведения маркетинговых и патентных исследований по объекту государственной экспертизы.
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
export class MarketingResearchResultsBlockComponent {

  @Input()
  num: string = "5.1";

  @Input()
  full: boolean = true;

  @Input()
  _form: { marketingResearchText: string };
}
