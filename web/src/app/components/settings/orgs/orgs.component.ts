import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {DataService} from "@app/services/data.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {IdNameDto} from "@app/dto/IdNameDto";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-orgs',
    templateUrl: './orgs.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.settings) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class OrgsComponent extends PropertyComponent<Orgs> implements OnInit {

  allOrgs: IdNameDto[] = [];

  constructor(protected _dataService: DataService,
              protected _toasty: GlobalToastyService,
              private cdr: ChangeDetectorRef) {
    super(_dataService, _toasty);
  }
  ngOnInit() {
    this._dataService.getOrgs().subscribe(res => {
      this.allOrgs = res;
      this.cdr?.markForCheck?.();
    });
  }
}

export class Orgs {
  gknt: IdNameDto;
  belisa: IdNameDto;
}
