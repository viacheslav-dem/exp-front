import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {LifecycleGroupState, LifecycleGroupStateBadge} from "@app/pipes/lifecycle-group-state.pipe";
import {LifecycleGroupTransitionHistoryDto} from "@app/dto/LifecycleGroupTransitionHistoryDto";
import {TransitionDto} from "@app/dto/TransitionDto";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-group-transition-history',
    templateUrl: './group-transition-history.component.html',
    styleUrls: ['group-transition-history.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.history) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class GroupTransitionHistoryComponent implements OnInit {

  LifecycleGroupStateBadge = LifecycleGroupStateBadge;
  _history: LifecycleGroupTransitionHistoryDto;
  hasInProcessingTransition: boolean = false;
  transitionsCount: number = 0;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  @Input() set history(history: LifecycleGroupTransitionHistoryDto) {
    if (!history) return;
    this._history = history;
    this.hasInProcessingTransition = !!this._history.transitions
      .find(transition => transition.newState == LifecycleGroupState.IN_PROCESSING);
    this.transitionsCount = this._history.transitions.length;
    this.cdr?.markForCheck?.();
  }

  showLifecycleHistories(transition: TransitionDto) {
    return this._history.lifecycleHistories.length != 0 && (transition.newState == LifecycleGroupState.IN_PROCESSING ||
      !this.hasInProcessingTransition && transition == this._history.transitions[this.transitionsCount - 1]);
  }
}
