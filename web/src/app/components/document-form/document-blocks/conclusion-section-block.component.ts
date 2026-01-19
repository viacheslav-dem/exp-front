import {Component, input, output} from '@angular/core';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {NewVoteResults} from "@app/components/document-form/meeting-protocol-form/NewVoteResults";
import {DecisionStateBadge} from "@app/pipes/decision.pipe";

@Component({
    selector: 'app-section-conclusion-block',
    template: `
    <div class="form-sub-group">
      <label>
        <span>{{num()}}.</span>
        <span>
          Заключение секции/бюро по объекту государственной экспертизы
          <i>{{project()?.title}}</i>:
        </span>
        <span class="ml-05" [ngClass]="['badge', DecisionStateBadge[_form().conclusion.getDecision()] || 'badge-info']">
          {{(_form().conclusion.getDecision() | decision) || 'не указано'}}
        </span>
      </label>
      <app-new-vote-results
        [(ngModel)]="_form().conclusion"
        [all]="allParticipants()"
        (onChanged)="onConditionsChanged.emit(true)"
      ></app-new-vote-results>
      @if (financeConclusionNum()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Положительное решение принимается, только если в пункте {{financeConclusionNum()}} имеется положительная оценка.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ConclusionSectionBlockComponent {

  DecisionStateBadge = DecisionStateBadge;

  readonly num = input<string>("11");

  readonly financeConclusionNum = input<string>(undefined);

  readonly full = input<boolean>(true);

  readonly disabled = input<boolean>(false);

  readonly project = input<ProjectPlainDto>(undefined);

  readonly _form = input<{
    conclusion: NewVoteResults;
}>(undefined);

  readonly allParticipants = input<number>(undefined);

  readonly onConditionsChanged = output<boolean>();
}
