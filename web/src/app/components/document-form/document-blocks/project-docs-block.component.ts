import {Component, input, output} from '@angular/core';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-project-docs-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Наличие проектной (предпроектной) документации:
      </label>
      <div>
        <input type="hidden" [ngModel]="_form()?.projectDocs" name="projectDocs" required>
        <app-boolean-button class="d-inline-block"
          name="projectDocs"
          required
          [ngModel]="_form()?.projectDocs"
          [trueLabel]="'разработана'"
          [falseLabel]="'не разработана'"
        (ngModelChange)="emitPatch({ projectDocs: $event })"></app-boolean-button>
      </div>
    
      <div>
        @if (full()) {
          <textarea
            [ngModel]="_form()?.projectDocsText"
            (ngModelChange)="emitPatch({ projectDocsText: $event })"
            [attr.name]="'projectDocsText_' + num().split('.').join('_')"
            required
            minlength="30"
            rows="3"
            class="form-control mt-05"
            placeholder="Обязательный текст (не менее 30 символов)."
          ></textarea>
        }
      </div>
    
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Если в материалах по обьекту государственной экспертизы отсутствует соответствующая информация, эксперт
            должен указать в даннном пункте заключения фразу «не представлено в материалах по обьекту государственной экспертизы»
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ProjectDocsBlockComponent {

    readonly num = input<string>("3.1");

    readonly full = input<boolean>(true);

    readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

    readonly _form = input<ProjectDocsBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<ProjectDocsBlockForm>>();

    emitPatch(patch: Partial<ProjectDocsBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type ProjectDocsBlockForm = {
  projectDocs: boolean;
  projectDocsText: string;
};