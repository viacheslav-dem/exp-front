import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-construction-work-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Необходимость осуществления работ в сфере строительной деятельности. Возведение, реконструкция,
        реставрация, капитальный ремонт, техническая модернизация зданий и сооружений, их благоустройство:
      </label>
      <app-boolean-button name="constructionWorks" required [ngModel]="_form()?.constructionWorks" [trueLabel]="'требуется'"
        [falseLabel]="'не требуется'"
      (ngModelChange)="emitPatch({ constructionWorks: $event })"></app-boolean-button>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.constructionWorksText"
          (ngModelChange)="emitPatch({ constructionWorksText: $event })"
          [attr.name]="'constructionWorksText_' + num().split('.').join('_')"
          required
          minlength="30"
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
            или сделайте пометку "не представлено в материалах по обькту государственной экспертизы".
            Если информация отсутствует, дайте свою экспертную оценку по данному вопросу.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ConstructionWorkBlockComponent {

    readonly num = input<string>("3");

    readonly full = input<boolean>(true);

    readonly _form = input<ConstructionWorkBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<ConstructionWorkBlockForm>>();

    emitPatch(patch: Partial<ConstructionWorkBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type ConstructionWorkBlockForm = {
  constructionWorks: boolean;
  constructionWorksText: string;
};