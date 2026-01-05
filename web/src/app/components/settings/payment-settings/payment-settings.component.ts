import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {DataService} from "@app/services/data.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-payment-settings',
    templateUrl: './payment-settings.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.settings) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class PaymentSettingsComponent extends PropertyComponent<PaymentSettings> {
  constructor(protected _dataService: DataService,
              protected _toasty: GlobalToastyService) {
    super(_dataService, _toasty);
  }
}

export class PaymentSettings {
  tariffRate1: number;
  pensionInsurance: number;
  pensionInsuranceForDisabled: number;
  socialInsurance: number;
  maxHoursChairman: number;
  maxHoursSecretary: number;
}

