import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";

@Component({
  selector: 'app-examination-policy',
  templateUrl: './examination-policy.component.html'
})
export class ExaminationPolicyComponent extends PropertyComponent<ExaminationPolicy> {
}

export class ExaminationPolicy {
  reviewContractDays: number;
  reviewMaxHours: number;
  reviewAutoSaveTime: number;
  sectionMeetingMinExperts: number;
  councilMeetingMaxHours: number;
  councilMeetingQuorum: number;
  importantMailingEnabled: boolean;
  reportMailingEnabled: boolean;
}
