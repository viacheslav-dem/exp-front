import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {ProjectLifecycleStateBadge} from "@app/pipes/lifecycle-state.pipe";
import {ProjectLifecycleTransitionHistoryDto} from "@app/dto/ProjectLifecycleTransitionHistoryDto";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-lifecycle-transition-history',
    templateUrl: './lifecycle-transition-history.component.html',
    styleUrls: ['lifecycle-transition-history.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.history) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class LifecycleTransitionHistoryComponent implements OnInit {

  ProjectLifecycleStateBadge = ProjectLifecycleStateBadge;
  _history: ProjectLifecycleTransitionHistoryDto;

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
