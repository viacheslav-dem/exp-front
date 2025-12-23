import {Component, input} from '@angular/core';
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {DecisionState, DecisionStateBadge} from "@app/pipes/decision.pipe";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-conclusion-council-block',
    template: `
    <div class="form-sub-group">
      <label class="font-weight-bold">
        Заключение государственного экспертного совета по объекту государственной экспертизы <i>{{project()?.title}}</i>:
        <span class="ml-05" [ngClass]="['badge', DecisionStateBadge[group().finalAgendaState || DecisionState.REJECTED] || 'badge-info']">
          {{group().finalAgendaState || DecisionState.REJECTED | decision}}
        </span>
      </label>
      <textarea [(ngModel)]="form().conclusionText" name="conclusionText" required rows="3" class="form-control"
      placeholder="Выводы и предложения (при необходимости)."></textarea>
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
export class ConclusionCouncilBlockComponent {

  DecisionStateBadge = DecisionStateBadge;
  DecisionState = DecisionState;

  readonly financeConclusionNum = input<string>(undefined);

  readonly project = input<ProjectDto>(undefined);

  readonly form = input<{
    conclusionText: string;
}>(undefined);

  readonly group = input<LifecycleGroupDto>(undefined);
}
