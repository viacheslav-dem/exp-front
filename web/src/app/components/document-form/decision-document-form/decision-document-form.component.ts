import {Component, Input} from '@angular/core';
import {DocumentForm} from "@app/components/document-form/document-form";
import {CouncilPlainDto} from "@app/dto/CouncilPlainDto";
import {isEmptyOrNull} from "@app/support/utils";

@Component({
    selector: 'app-decision-document-form',
    templateUrl: './decision-document-form.component.html',
    standalone: false
})
export class DecisionDocumentFormComponent extends DocumentForm<any> {

  @Input() needCauses: boolean = true;
  @Input() project: any = {};
  @Input() council: CouncilPlainDto;
  causes: {name: string}[] = [];

  getForm() {
    let form = super.getForm();
    form.causes = this.causes.map(obj => obj.name).filter(cause => !isEmptyOrNull(cause));
    return form;
  }

  validate() {
    super.validate();
    if (this.needCauses && this.causes.filter(cause => !isEmptyOrNull(cause.name)).length == 0) {
      throw 'Не указаны причины возврата объекта экспертизы.';
    }
  }
}
