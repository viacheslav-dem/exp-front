import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {AuthPolicy} from "@app/dto/PropertyDto";
import {DataService} from "@app/services/data.service";
import {ToastyService} from "ng2-toasty";

@Component({
  selector: 'app-auth-policy',
  templateUrl: './auth-policy.component.html'
})
export class AuthPolicyComponent extends PropertyComponent<AuthPolicy> {
  constructor(protected _dataService: DataService,
              protected _toasty: ToastyService) {
    super(_dataService, _toasty);
  }
}


