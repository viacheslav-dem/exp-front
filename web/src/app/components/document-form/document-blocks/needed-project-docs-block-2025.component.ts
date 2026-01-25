import {Component, input, output} from "@angular/core";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-needed-project-docs-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Разработка проектной (предпроектной) документации:
      </label>
      <input type="hidden" [ngModel]="_form()?.neededProjectDocs" name="neededProjectDocs" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form()?.neededProjectDocs === true}" (click)="stateButton(true)">
          Требуется
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form()?.neededProjectDocs === false}" (click)="stateButton(false)">
          Не требуется
        </button>
      </div>
    
      <div>
        @if (full()) {
          <textarea
            [ngModel]="_form()?.neededProjectDocsText"
            (ngModelChange)="emitPatch({ neededProjectDocsText: $event })"
            [name]="'neededProjectDocsText_' + num().split('.').join('_')"
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
            При отсутствии разработанной проектной (предпроектной) документации на обьект (в случае, когда ее разработка требуется)
            на момент проведения государственной экспертизы или отсутствие соответствующей информации в материалах по обьекту государственной
            экспертизы (в случае, когда экспертом сделан вывод о целесообразном проведении работ в сфере строительной деятельности) оценка по обьекту
            государственной экспертизы дается с государственную экспертизу с актуализацией бизнес-плана с учетом новых обьемов и источников
            финансирования после разработки проектной (предпроектной) документации на обьект и прохождения ею соответствующих экспертиз.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class NeededProjectDocsBlock2025Component {

    readonly num = input<string>("3.2");

    readonly full = input<boolean>(true);

    readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

    readonly _form = input<NeededProjectDocsBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<NeededProjectDocsBlock2025Form>>();

    emitPatch(patch: Partial<NeededProjectDocsBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    stateButton(flag: boolean){
        this.emitPatch({ neededProjectDocs: flag });
    }

}

type NeededProjectDocsBlock2025Form = {
    neededProjectDocs: boolean;
    neededProjectDocsText: string;
};