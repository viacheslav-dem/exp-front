import {Component, OnInit} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {DataService} from "@app/services/data.service";
import {ToastyService} from "ng2-toasty";
import {IdNameDto} from "@app/dto/IdNameDto";

@Component({
  selector: 'app-orgs',
  templateUrl: './orgs.component.html'
})
export class OrgsComponent extends PropertyComponent<Orgs> implements OnInit {

  allOrgs: IdNameDto[] = [];

  constructor(protected _dataService: DataService,
              protected _toasty: ToastyService) {
    super(_dataService, _toasty);
  }
  ngOnInit() {
    this._dataService.getOrgs().subscribe(res => this.allOrgs = res);
  }
}

export class Orgs {
  gknt: IdNameDto;
  belisa: IdNameDto;
}
