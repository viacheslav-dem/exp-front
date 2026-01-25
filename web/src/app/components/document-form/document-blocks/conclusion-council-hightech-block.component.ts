import {Component, input, output} from '@angular/core';
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {DecisionState, DecisionStateBadge} from "@app/pipes/decision.pipe";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-conclusion-council-hightech-block',
    template: `
    <div class="form-sub-group">
      <label class="font-weight-bold">
        Заключение государственного экспертного совета по объекту государственной экспертизы <i>{{project()?.title}}</i>:
        <span class="ml-05" [ngClass]="['badge', DecisionStateBadge[group()?.finalAgendaState || DecisionState.REJECTED] || 'badge-info']">
          {{group()?.finalAgendaState || DecisionState.REJECTED | decision}}
        </span>
      </label>
      <textarea [ngModel]="form()?.conclusionText" (ngModelChange)="emitPatch({ conclusionText: $event })" name="conclusionText" rows="3" class="form-control"
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
export class ConclusionCouncilHightechBlockComponent {

    DecisionStateBadge = DecisionStateBadge;
    DecisionState = DecisionState;

    readonly financeConclusionNum = input<string>(undefined);

    readonly project = input<ProjectDto>(undefined);

    readonly form = input<ConclusionCouncilHightechBlockForm>(undefined);

    readonly group = input<LifecycleGroupDto>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<ConclusionCouncilHightechBlockForm>>();

    emitPatch(patch: Partial<ConclusionCouncilHightechBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type ConclusionCouncilHightechBlockForm = {
  conclusionText: string;
};
