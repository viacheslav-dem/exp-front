import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {DataService} from "@app/services/data.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {HighTechCriteria} from "@app/components/document-form/form-model/high-tech-criteria";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-high-tech-criteria',
    templateUrl: './high-tech-criteria.component.html',
    styleUrls: ['./high-tech-criteria.component.scss'],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.settings)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class HighTechCriteriaComponent extends PropertyComponent<HighTechCriteria> {
  constructor(protected _dataService: DataService,
              protected _toasty: GlobalToastyService,
              private cdr: ChangeDetectorRef) {
    super(_dataService, _toasty);
  }
  
  override setProperty(property: any) {
    super.setProperty(property);
    this.cdr?.markForCheck?.();
  }
  
  override onSaved() {
    super.onSaved();
    this.cdr?.markForCheck?.();
  }
}
