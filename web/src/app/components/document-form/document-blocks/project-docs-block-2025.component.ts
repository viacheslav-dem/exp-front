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
      <input type="hidden" [ngModel]="_form()?.projectDocs" name="projectDocs" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form()?.projectDocs === true}" (click)="stateButton(true)">
          Разработана
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form()?.projectDocs === false}" (click)="stateButton(false)">
          Не разработана
        </button>
      </div>
      <div>
        @if (full()) {
          <textarea
            [ngModel]="_form()?.projectDocsText"
            (ngModelChange)="emitPatch({ projectDocsText: $event })"
            [name]="'projectDocsText_' + num().split('.').join('_')"
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

    readonly _form = input<ProjectDocsBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<ProjectDocsBlock2025Form>>();

    emitPatch(patch: Partial<ProjectDocsBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    stateButton(flag: boolean){
        this.emitPatch({ projectDocs: flag });
    }
}

type ProjectDocsBlock2025Form = {
    projectDocs: boolean;
    projectDocsText: string;
};