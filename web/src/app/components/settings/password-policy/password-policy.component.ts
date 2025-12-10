import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {DataService} from "@app/services/data.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";

@Component({
    selector: 'app-password-policy',
    templateUrl: './password-policy.component.html',
    standalone: false
})
export class PasswordPolicyComponent extends PropertyComponent<PasswordPolicy> {
  constructor(protected _dataService: DataService,
              protected _toasty: GlobalToastyService) {
    super(_dataService, _toasty);
  }
}

export class PasswordPolicy {
  generatePattern: string;
  validatePattern: string;
  defaultPassword: string;
  validTermInDays: number;
}
