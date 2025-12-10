import {Component, ViewChild} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {DataService} from "@app/services/data.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {PropertyDto} from "@app/dto/PropertyDto";
import * as _ from "lodash";
import {Role} from "@app/pipes/role.pipe";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {SearchPersonByRolesComponent} from "@app/components/search/search-person/search-person-by-role.component";

@Component({
    selector: 'app-gknt-deputy-chairman-procurations',
    templateUrl: './gknt-deputy-chairman-procurations.component.html',
    standalone: false
})
export class GkntDeputyChairmanProcurationsComponent extends PropertyComponent<Procurations> {

  constructor(protected _dataService: DataService,
              protected _toasty: GlobalToastyService) {
    super(_dataService, _toasty);
  }

  Role = Role;

  persons: string[];
  procurations: {[key: string]: Procuration};
  editedPerson: string;
  editedProcuration: Procuration;

  @ViewChild(SearchPersonByRolesComponent, { static: false }) public searchPersonModal: SearchPersonByRolesComponent;

  setProperty(property: PropertyDto) {
    super.setProperty(property);
    this.procurations = this.value.procurations;
    this.persons = Object.keys(this.procurations);
    this.persons.sort();
  }

  edit(person?: string) {
    this.cancelEdit();
    this.editedPerson = person;
    this.procurations[person].isEdit = true;
    this.editedProcuration = _.cloneDeep(this.procurations[person]);
  }

  saveEditedProcuration() {
    this.procurations[this.editedPerson] = this.editedProcuration;
    this.savePropertyValue();
  }

  savePropertyValue() {
    this.editedValue = this.value;
    super.savePropertyValue();
  }

  deleteProcuration() {
    this.persons = this.persons.filter(person => person != this.editedPerson);
    delete this.procurations[this.editedPerson];
    this.savePropertyValue();
  }

  onSaved() {
    this.cancelEdit();
  }

  cancelEdit() {
    if (this.procurations[this.editedPerson]) {
      this.procurations[this.editedPerson].isEdit = false;
    }
    this.editedPerson = null;
  }

  selectPerson(person: PersonPlainDto) {
    let fullName = person.personName.lastName + ' ' + person.personName.firstName + ' ' + person.personName.middleName;
    this.procurations[fullName] = new Procuration();
    this.savePropertyValue();
    this.searchPersonModal.hide();
  }

  showSearchPersonModal() {
    this.searchPersonModal.show();
  }
}

export class Procuration {
  date: number;
  code: string;
  isEdit: boolean;
}

export class Procurations {
  procurations: {[key: string]: Procuration};
}
