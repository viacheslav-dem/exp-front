import {Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {DataService} from "@app/services/data.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {PropertyDto} from "@app/dto/PropertyDto";
import * as _ from "lodash";
import {Role} from "@app/pipes/role.pipe";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {SearchPersonByRolesComponent} from "@app/components/search/search-person/search-person-by-role.component";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-gknt-deputy-chairman-procurations',
    templateUrl: './gknt-deputy-chairman-procurations.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.settings)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class GkntDeputyChairmanProcurationsComponent extends PropertyComponent<Procurations> {

  constructor(protected _dataService: DataService,
              protected _toasty: GlobalToastyService,
              private cdr: ChangeDetectorRef) {
    super(_dataService, _toasty);
  }

  Role = Role;

  persons: string[];
  procurations: {[key: string]: Procuration};
  editedPerson: string;
  editedProcuration: Procuration;

  @ViewChild(SearchPersonByRolesComponent, { static: false }) public searchPersonModal: SearchPersonByRolesComponent;

  override setProperty(property: PropertyDto) {
    super.setProperty(property);
    this.procurations = this.value.procurations;
    this.persons = Object.keys(this.procurations);
    this.persons.sort();
    this.cdr?.markForCheck?.();
  }

  edit(person?: string) {
    this.cancelEdit();
    this.editedPerson = person;
    this.procurations[person].isEdit = true;
    this.editedProcuration = _.cloneDeep(this.procurations[person]);
    this.cdr?.markForCheck?.();
  }

  saveEditedProcuration() {
    this.procurations[this.editedPerson] = this.editedProcuration;
    this.savePropertyValue();
  }

  override savePropertyValue() {
    this.editedValue = this.value;
    super.savePropertyValue();
  }

  deleteProcuration() {
    this.persons = this.persons.filter(person => person != this.editedPerson);
    delete this.procurations[this.editedPerson];
    this.savePropertyValue();
  }

  override onSaved() {
    this.cancelEdit();
    this.cdr?.markForCheck?.();
  }

  cancelEdit() {
    if (this.procurations[this.editedPerson]) {
      this.procurations[this.editedPerson].isEdit = false;
    }
    this.editedPerson = null;
    this.cdr?.markForCheck?.();
  }

  selectPerson(person: PersonPlainDto) {
    let fullName = person.personName.lastName + ' ' + person.personName.firstName + ' ' + person.personName.middleName;
    this.procurations[fullName] = new Procuration();
    this.savePropertyValue();
    this.searchPersonModal.hide();
    this.cdr?.markForCheck?.();
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
