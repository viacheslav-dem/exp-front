import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {AuthPolicy} from "@app/dto/PropertyDto";
import {DataService} from "@app/services/data.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";

@Component({
  selector: 'app-auth-policy',
  templateUrl: './auth-policy.component.html'
})
export class AuthPolicyComponent extends PropertyComponent<AuthPolicy> {
  constructor(protected _dataService: DataService,
              protected _toasty: GlobalToastyService) {
    super(_dataService, _toasty);
  }
}


