import {Component, input} from '@angular/core';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {DecisionStateBadge} from "@app/pipes/decision.pipe";
import {AgendaNewFormContent} from "@app/components/document-form/meeting-protocol-form/AgendaNewFormContent";

@Component({
    selector: 'app-agenda-header-block',
    template: `
    <label class="form-group-label mb-0 selectable">
      <span>{{ind() + 1}}. {{project() | titleAndCode}}</span>
      <span> | Решение:</span>
      <span class="ms-05" [ngClass]="['badge', DecisionStateBadge[_form().conclusion.getDecision()] || 'badge-info']">
        {{(_form().conclusion.getDecision() | decision) || 'не указано'}}
      </span>
      <button class="btn btn-icon ms-05 d-none"
              data-bs-toggle="collapse"
              [attr.data-bs-target]="'#meeting-project-' + project()?.id">
      </button>
    </label>
  `,
    standalone: false
})
export class AgendaHeaderBlockComponent {

  DecisionStateBadge = DecisionStateBadge;

  readonly ind = input<number>(undefined);

  readonly project = input<ProjectPlainDto>(undefined);

  readonly _form = input<AgendaNewFormContent>(undefined);
}
