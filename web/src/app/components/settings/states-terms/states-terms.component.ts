import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {DataService} from "@app/services/data.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-states-terms',
    templateUrl: './states-terms.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.settings)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class StatesTermsComponent extends PropertyComponent<StatesTerms> {
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

export class StatesTerms {
  examination_8_9_12IP_Terms: number;
  examinationExcept_8_9_12IP_Terms: number;
  gkntCheckingAndSigningTerms: number;
  attachSectionsTerms: number;
  expertReviewTerms: number;
  expertConfirmationTerms: number;
  paymentTerms: number;
}
