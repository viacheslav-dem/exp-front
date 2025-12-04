import {Component, Input, OnInit} from "@angular/core";
import {ProjectLifecycleStateBadge} from "@app/pipes/lifecycle-state.pipe";
import {ProjectLifecycleTransitionHistoryDto} from "@app/dto/ProjectLifecycleTransitionHistoryDto";

@Component({
    selector: 'app-lifecycle-transition-history',
    templateUrl: './lifecycle-transition-history.component.html',
    styles: [`
      table {
          font-size: 0.875rem;
      }
  `],
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
