import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-scientific-level-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Оценка научно-технического уровня внедряемых технологий по сравнению с передовыми технологиями, 
        используемыми в мире, и возможности их применения на соответствующем производстве.
      </label>
      <textarea [(ngModel)]="_form.scientificLevel" rows="3" class="form-control"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Проведите оценку научно-технического уровня внедряемых технологий по сравнению с передовыми 
          технологиями для объекта государственной экспертизы.
        </p>
        <p>
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          или сделайте пометку "не представлено в материалах по объекту государственной экспертизы"
          и дайте свою экспертную оценку по данному вопросу.
        </p>
      </div>
    </div>
  `
})
export class ScientificLevelBlockComponent {

  @Input()
  num: string = "1.1";

  @Input()
  full: boolean = true;

  @Input()
  _form: { scientificLevel: string };
}
