import {Component, OnInit} from "@angular/core";
import {PersonService} from "@app/services/person.service";
import {OrgDto} from "@app/dto/OrgDto";
import {PersonDto} from "@app/dto/PersonDto";
import {DataService} from "@app/services/data.service";

@Component({
    selector: 'app-sub-org-list',
    templateUrl: 'sub-org-list.component.html',
    standalone: false
})

export class SubOrgListComponent implements OnInit {

  orgs: OrgDto[] = [];
  person: PersonDto;

  constructor(private _personService: PersonService,
              private _dataService: DataService) {
  }

  ngOnInit() {
    this._personService.getCurrentPerson().subscribe(person => {
      this.person = person;
      this._dataService.getSubOrgs(this.person.org).subscribe(
        orgs => this.orgs = orgs
      );
    })
  }
}