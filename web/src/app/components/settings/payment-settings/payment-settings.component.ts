import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";

@Component({
  selector: 'app-payment-settings',
  templateUrl: './payment-settings.component.html'
})
export class PaymentSettingsComponent extends PropertyComponent<PaymentSettings> {
}

export class PaymentSettings {
  tariffRate1: number;
  pensionInsurance: number;
  pensionInsuranceForDisabled: number;
  socialInsurance: number;
  maxHoursChairman: number;
  maxHoursSecretary: number;
}

