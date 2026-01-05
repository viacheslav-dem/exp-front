import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {ProjectLifecycleTransitionHistoryDto} from "@app/dto/ProjectLifecycleTransitionHistoryDto";
import {ExpertReviewStateBadge} from "@app/pipes/review-state.pipe";
import {ExpertTransitionHistoryDto} from "@app/dto/ExpertTransitionHistoryDto";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-expert-transition-history',
    templateUrl: './expert-transition-history.component.html',
    styleUrls: ['expert-transition-history.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.history) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class ExpertTransitionHistoryComponent implements OnInit {

  ExpertReviewStateBadge = ExpertReviewStateBadge;
  _history: ExpertTransitionHistoryDto;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  @Input() set history(history: ProjectLifecycleTransitionHistoryDto) {
    if (!history) return;
    this._history = history;
    this.cdr?.markForCheck?.();
  }
}
