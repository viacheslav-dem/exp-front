import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {HighTechCriteria} from "@app/components/document-form/form-model/high-tech-criteria";

@Component({
  selector: 'app-high-tech-criteria',
  templateUrl: './high-tech-criteria.component.html',
  styleUrls: ['./high-tech-criteria.component.scss']
})
export class HighTechCriteriaComponent extends PropertyComponent<HighTechCriteria> {
}
