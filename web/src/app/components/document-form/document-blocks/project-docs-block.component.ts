import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-project-docs-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Наличие проектной (предпроектной) документации:
      </label>
      <div>
        <app-boolean-button class="d-inline-block"
                            [(ngModel)]="_form.projectDocs"
                            [trueLabel]="'разработана'"
                            [falseLabel]="'не разработана'"
                            (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      </div>
        
            <div>
                <textarea *ngIf="full" [(ngModel)]="_form.projectDocsText" rows="3" class="form-control mt-05"
                          placeholder="Обязательный текст."></textarea>
            </div>

        <div *ngIf="full" class="hint">
            <p>
                <b>Подсказка.</b>
                Если в материалах по обьекту государственной экспертизы отсутствует соответствующая информация, эксперт 
                должен указать в даннном пункте заключения фразу «не представлено в материалах по обьекту государственной экспертизы»
            </p>
        </div>
    </div>
  `
})
export class ProjectDocsBlockComponent {

    @Input()
    num: string = "3.1";

    @Input()
    full: boolean = true;

    @Input()
    project: ProjectPlainDto | ProjectDto;

    @Input()
    _form: { projectDocs: boolean, projectDocsText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}