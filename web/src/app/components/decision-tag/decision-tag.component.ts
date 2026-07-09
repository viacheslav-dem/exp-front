import {ChangeDetectionStrategy, Component, OnInit, input} from '@angular/core';
import {DecisionStateBadge} from "@app/pipes/decision.pipe";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-decision-tag',
    templateUrl: './decision-tag.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Eager
})
export class DecisionTagComponent implements OnInit {

  DecisionStateBadge = DecisionStateBadge;

  readonly decision = input<any>(undefined);

  constructor() {
  }

  ngOnInit() {
  }

}
