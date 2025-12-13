import {Component, Input, OnInit} from "@angular/core";
import {ProjectLifecycleStateBadge} from "@app/pipes/lifecycle-state.pipe";
import {ProjectLifecycleTransitionHistoryDto} from "@app/dto/ProjectLifecycleTransitionHistoryDto";

@Component({
    selector: 'app-lifecycle-transition-history',
    templateUrl: './lifecycle-transition-history.component.html',
    styleUrls: ['lifecycle-transition-history.component.scss'],
    standalone: false
})
export class LifecycleTransitionHistoryComponent implements OnInit {

  ProjectLifecycleStateBadge = ProjectLifecycleStateBadge;
  _history: ProjectLifecycleTransitionHistoryDto;

  ngOnInit(): void {
  }

  @Input() set history(history: ProjectLifecycleTransitionHistoryDto) {
    if (!history) return;
    this._history = history;
  }
}
