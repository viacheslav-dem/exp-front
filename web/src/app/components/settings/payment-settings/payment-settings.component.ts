import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {DataService} from "@app/services/data.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";

@Component({
    selector: 'app-payment-settings',
    templateUrl: './payment-settings.component.html',
    standalone: false
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

