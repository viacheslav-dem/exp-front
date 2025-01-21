import {Component, OnInit} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {IdNameDto} from "@app/dto/IdNameDto";

@Component({
  selector: 'app-orgs',
  templateUrl: './orgs.component.html'
})
export class OrgsComponent extends PropertyComponent<Orgs> implements OnInit {

  allOrgs: IdNameDto[] = [];

  ngOnInit() {
    this._dataService.getOrgs().subscribe(res => this.allOrgs = res);
  }
}

export class Orgs {
  gknt: IdNameDto;
  belisa: IdNameDto;
}
