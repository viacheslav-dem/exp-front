import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {DataService} from "@app/services/data.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {HighTechCriteria} from "@app/components/document-form/form-model/high-tech-criteria";

@Component({
  selector: 'app-high-tech-criteria',
  templateUrl: './high-tech-criteria.component.html',
  styleUrls: ['./high-tech-criteria.component.scss']
})
export class HighTechCriteriaComponent extends PropertyComponent<HighTechCriteria> {
  constructor(protected _dataService: DataService,
              protected _toasty: GlobalToastyService) {
    super(_dataService, _toasty);
  }
}
