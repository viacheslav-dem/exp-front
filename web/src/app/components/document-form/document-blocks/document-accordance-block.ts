import {Component, input, output} from '@angular/core';
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";

@Component({
    selector: 'app-document-accordance-block',
    template: `
        <div class="form-sub-group">
            <label>
                {{num()}} Соответствие указанному приоритетному направлению научных исследований в Республике Беларусь и (или)
                научно-технической деятельности в Республики Беларусь:
            </label>
            <app-boolean-button class="d-inline-block"
                                [(ngModel)]="_form().isAccordance"
                                [trueLabel]="'да'"
                                [falseLabel]="'нет'"
                                (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
        </div>
  `,
    standalone: false
})
export class DocumentAccordanceBlock {

    readonly num = input<string>("9.3");

    readonly full = input<boolean>(true);

    readonly isTextRequired = input<boolean>(false);

    readonly _form = input<{
    isAccordance: boolean;
}>(undefined);

    readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

    readonly onConditionsChanged = output<boolean>();
}
