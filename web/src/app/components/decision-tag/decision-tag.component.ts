import {Component, Input, OnInit} from '@angular/core';
import {DecisionStateBadge} from "@app/pipes/decision.pipe";

@Component({
    selector: 'app-decision-tag',
    templateUrl: './decision-tag.component.html',
    standalone: false
})
export class DecisionTagComponent implements OnInit {

  DecisionStateBadge = DecisionStateBadge;

  @Input() decision: any;

  constructor() {
  }

  ngOnInit() {
  }

}
