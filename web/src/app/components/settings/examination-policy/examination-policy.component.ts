import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {DataService} from "@app/services/data.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-examination-policy',
    templateUrl: './examination-policy.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.settings)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class ExaminationPolicyComponent extends PropertyComponent<ExaminationPolicy> {
  constructor(protected _dataService: DataService,
              protected _toasty: GlobalToastyService,
              private cdr: ChangeDetectorRef) {
    super(_dataService, _toasty);
  }
  
  override setProperty(property: any) {
    super.setProperty(property);
    this.cdr?.markForCheck?.();
  }
  
  override onSaved() {
    super.onSaved();
    this.cdr?.markForCheck?.();
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
