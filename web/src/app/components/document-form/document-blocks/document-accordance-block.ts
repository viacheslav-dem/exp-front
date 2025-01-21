import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";

@Component({
    selector: 'app-document-accordance-block',
    template: `
        <div class="form-sub-group">
            <label>
                {{num}} Соответствие указанному приоритетному направлению научных исследований в Республике Беларусь и (или)
                научно-технической деятельности в Республики Беларусь:
            </label>
            <app-boolean-button class="d-inline-block"
                                [(ngModel)]="_form.isAccordance"
                                [trueLabel]="'да'"
                                [falseLabel]="'нет'"
                                (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
        </div>
  `
})
export class DocumentAccordanceBlock {

    @Input()
    num: string = "9.3";

    @Input()
    full: boolean = true;

    @Input()
    isTextRequired: boolean = false;

    @Input()
    _form: { isAccordance: boolean};

    @Input()
    project: ProjectPlainDto | ProjectDto;

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
