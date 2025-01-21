import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {AuthPolicy} from "@app/dto/PropertyDto";

@Component({
  selector: 'app-auth-policy',
  templateUrl: './auth-policy.component.html'
})
export class AuthPolicyComponent extends PropertyComponent<AuthPolicy> {
}


