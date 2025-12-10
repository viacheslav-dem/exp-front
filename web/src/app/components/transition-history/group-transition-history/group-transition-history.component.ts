import {Component, Input, OnInit} from "@angular/core";
import {LifecycleGroupState, LifecycleGroupStateBadge} from "@app/pipes/lifecycle-group-state.pipe";
import {LifecycleGroupTransitionHistoryDto} from "@app/dto/LifecycleGroupTransitionHistoryDto";
import {TransitionDto} from "@app/dto/TransitionDto";

@Component({
    selector: 'app-group-transition-history',
    templateUrl: './group-transition-history.component.html',
    styles: [`
      table {
          font-size: 0.875rem;
      }
  `],
    standalone: false
})
export class GroupTransitionHistoryComponent implements OnInit {

  LifecycleGroupStateBadge = LifecycleGroupStateBadge;
  _history: LifecycleGroupTransitionHistoryDto;
  hasInProcessingTransition: boolean = false;
  transitionsCount: number = 0;

  ngOnInit(): void {
  }

  @Input() set history(history: LifecycleGroupTransitionHistoryDto) {
    if (!history) return;
    this._history = history;
    this.hasInProcessingTransition = !!this._history.transitions
      .find(transition => transition.newState == LifecycleGroupState.IN_PROCESSING);
    this.transitionsCount = this._history.transitions.length;
  }

  showLifecycleHistories(transition: TransitionDto) {
    return this._history.lifecycleHistories.length != 0 && (transition.newState == LifecycleGroupState.IN_PROCESSING ||
      !this.hasInProcessingTransition && transition == this._history.transitions[this.transitionsCount - 1]);
  }
}
