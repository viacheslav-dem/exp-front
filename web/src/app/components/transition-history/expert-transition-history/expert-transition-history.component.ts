import {Component, Input, OnInit} from "@angular/core";
import {ProjectLifecycleTransitionHistoryDto} from "@app/dto/ProjectLifecycleTransitionHistoryDto";
import {ExpertReviewStateBadge} from "@app/pipes/review-state.pipe";
import {ExpertTransitionHistoryDto} from "@app/dto/ExpertTransitionHistoryDto";

@Component({
    selector: 'app-expert-transition-history',
    templateUrl: './expert-transition-history.component.html',
    styles: [`
      table {
          font-size: 0.875rem;
      }
  `],
    standalone: false
})
export class ExpertTransitionHistoryComponent implements OnInit {

  ExpertReviewStateBadge = ExpertReviewStateBadge;
  _history: ExpertTransitionHistoryDto;

  ngOnInit(): void {
  }

  @Input() set history(history: ProjectLifecycleTransitionHistoryDto) {
    if (!history) return;
    this._history = history;
  }
}
