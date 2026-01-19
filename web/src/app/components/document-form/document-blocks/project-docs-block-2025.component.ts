import {Component, input, output} from "@angular/core";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-project-docs-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Наличие проектной (предпроектной) документации:
      </label>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().projectDocs === true}" (click)="stateButton(true)">
          Разработана
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().projectDocs === false}" (click)="stateButton(false)">
          Не разработана
        </button>
      </div>
      <div>
        @if (full()) {
          <textarea
            [(ngModel)]="_form().projectDocsText"
            [attr.name]="'projectDocsText_' + num().split('.').join('_')"
            required
            minlength="30"
            maxlength="5000"
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
export class ProjectDocsBlock2025Component {

    readonly num = input<string>("3.1");

    readonly full = input<boolean>(true);

    readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

    readonly _form = input<{
    projectDocs: boolean;
    projectDocsText: string;
}>(undefined);

    readonly onConditionsChanged = output<boolean>();

    stateButton(flag: boolean){
        if(flag){
            this._form().projectDocs = true;
        } else {
            this._form().projectDocs = false;
        }
    }
}