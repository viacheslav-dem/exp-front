import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";

@Component({
  selector: 'app-password-policy',
  templateUrl: './password-policy.component.html'
})
export class PasswordPolicyComponent extends PropertyComponent<PasswordPolicy> {
}

export class PasswordPolicy {
  generatePattern: string;
  validatePattern: string;
  defaultPassword: string;
  validTermInDays: number;
}
