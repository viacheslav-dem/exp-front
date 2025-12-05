import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {DataService} from "@app/services/data.service";
import {ToastyService} from "ng2-toasty";

@Component({
  selector: 'app-password-policy',
  templateUrl: './password-policy.component.html'
})
export class PasswordPolicyComponent extends PropertyComponent<PasswordPolicy> {
  constructor(protected _dataService: DataService,
              protected _toasty: ToastyService) {
    super(_dataService, _toasty);
  }
}

export class PasswordPolicy {
  generatePattern: string;
  validatePattern: string;
  defaultPassword: string;
  validTermInDays: number;
}
