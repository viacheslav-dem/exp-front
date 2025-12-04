import {Component, EventEmitter, Output, input} from '@angular/core';
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
        <app-boolean-button class="d-inline-block"
          [(ngModel)]="_form().projectDocs"
          [trueLabel]="'разработана'"
          [falseLabel]="'не разработана'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      </div>
    
      <div>
        @if (full()) {
          <textarea [(ngModel)]="_form().projectDocsText" rows="3" class="form-control mt-05"
          placeholder="Обязательный текст."></textarea>
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

    readonly _form = input<{
    projectDocs: boolean;
    projectDocsText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}