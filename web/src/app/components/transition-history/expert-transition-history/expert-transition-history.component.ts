import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, effect, input} from "@angular/core";
import {ProjectLifecycleTransitionHistoryDto} from "@app/dto/ProjectLifecycleTransitionHistoryDto";
import {ExpertReviewStateBadge} from "@app/pipes/review-state.pipe";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-expert-transition-history',
    templateUrl: './expert-transition-history.component.html',
    styleUrls: ['expert-transition-history.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.history) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Eager
})
export class ExpertTransitionHistoryComponent implements OnInit {

  ExpertReviewStateBadge = ExpertReviewStateBadge;
  _history: ProjectLifecycleTransitionHistoryDto;

  readonly history = input<ProjectLifecycleTransitionHistoryDto | undefined>(undefined);
  private readonly _historyEffect = effect(() => {
    const history = this.history();
    if (!history) return;
    this._history = history;
    this.cdr?.markForCheck?.();
  });

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }


}
