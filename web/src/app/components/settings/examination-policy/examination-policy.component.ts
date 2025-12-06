import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {DataService} from "@app/services/data.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";

@Component({
  selector: 'app-examination-policy',
  templateUrl: './examination-policy.component.html'
})
export class ExaminationPolicyComponent extends PropertyComponent<ExaminationPolicy> {
  constructor(protected _dataService: DataService,
              protected _toasty: GlobalToastyService) {
    super(_dataService, _toasty);
  }
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
