import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {DataService} from "@app/services/data.service";
import {ToastyService} from "ng2-toasty";

@Component({
  selector: 'app-states-terms',
  templateUrl: './states-terms.component.html'
})
export class StatesTermsComponent extends PropertyComponent<StatesTerms> {
  constructor(protected _dataService: DataService,
              protected _toasty: ToastyService) {
    super(_dataService, _toasty);
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
