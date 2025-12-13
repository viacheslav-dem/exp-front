import {Component, Input, OnInit} from "@angular/core";
import {ProjectTransitionHistoryDto} from "app/dto/ProjectTransitionHistoryDto";
import {ProjectState, ProjectStateBadge} from "app/pipes/project-state.pipe";
import {TransitionDto} from "@app/dto/TransitionDto";

@Component({
    selector: 'app-project-transition-history',
    templateUrl: './project-transition-history.component.html',
    styleUrls: ['project-transition-history.component.scss'],
    standalone: false
})
export class ProjectTransitionHistoryComponent implements OnInit {

  ProjectStateBadge = ProjectStateBadge;

  _history: ProjectTransitionHistoryDto;
  hasOnExaminationTransition: boolean = false;
  transitionsCount: number = 0;
  hasOnExpertExaminationTransition: boolean = false;

  ngOnInit(): void {
  }

  @Input() set history(history: ProjectTransitionHistoryDto) {
    if (!history) return;
    this._history = history;
    this.hasOnExaminationTransition = !!this._history.transitions
      .find(transition => transition.newState == ProjectState.ON_EXAMINATION);
    this.hasOnExpertExaminationTransition = !!this._history.transitions
      .find(transition => transition.newState == ProjectState.ON_EXPERT_EXAMINATION);
    this.transitionsCount = this._history.transitions.length;
  }

  showGroupHistories(transition: TransitionDto) {
    return this._history.groupHistories.length != 0 &&
      (transition.newState == ProjectState.ON_EXAMINATION ||
        !this.hasOnExaminationTransition && this.showExpertHistories(transition));
  }

  showExpertHistories(transition: TransitionDto) {
    if (this._history.expertHistories.length == 0) {
      return false;
    }
    return this._history.expertHistories.length != 0 &&
      (transition.newState == ProjectState.ON_EXPERT_EXAMINATION ||
        !this.hasOnExpertExaminationTransition && transition == this._history.transitions[this.transitionsCount - 1]);
  }
}
