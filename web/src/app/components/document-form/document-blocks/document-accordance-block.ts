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
                                [ngModel]="_form()?.isAccordance"
                                (ngModelChange)="emitPatch({ isAccordance: $event })"
                                [trueLabel]="'да'"
                                [falseLabel]="'нет'"
            ></app-boolean-button>
        </div>
  `,
    standalone: false
})
export class DocumentAccordanceBlock {

    readonly num = input<string>("9.3");

    readonly full = input<boolean>(true);

    readonly isTextRequired = input<boolean>(false);

    readonly _form = input<DocumentAccordanceBlockForm>(undefined);

    readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<DocumentAccordanceBlockForm>>();

    emitPatch(patch: Partial<DocumentAccordanceBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type DocumentAccordanceBlockForm = {
  isAccordance: boolean;
};
