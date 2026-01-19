import {Component, input, ChangeDetectionStrategy} from '@angular/core';
import {DocumentForm} from "@app/components/document-form/document-form";
import {CouncilPlainDto} from "@app/dto/CouncilPlainDto";
import {isEmptyOrNull} from "@app/support/utils";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-decision-document-form',
    templateUrl: './decision-document-form.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class DecisionDocumentFormComponent extends DocumentForm<any> {

  readonly needCauses = input<boolean>(true);
  readonly project = input<any>({});
  readonly council = input<CouncilPlainDto>(undefined);
  readonly loading = input<boolean>(false);
  causes: {name: string}[] = [];

  getForm() {
    let form = super.getForm();
    form.causes = this.causes.map(obj => obj.name).filter(cause => !isEmptyOrNull(cause));
    return form;
  }

  validate() {
    super.validate();
    if (this.needCauses() && this.causes.filter(cause => !isEmptyOrNull(cause.name)).length == 0) {
      throw 'Не указаны причины возврата объекта экспертизы.';
    }
  }
}
