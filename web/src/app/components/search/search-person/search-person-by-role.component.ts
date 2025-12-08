import {Component, Input} from '@angular/core';
import {SearchPersonComponent} from "app/components/search/search-person/search-person.component";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";

@Component({
  selector: 'app-search-person-by-roles',
  templateUrl: './search-person.component.html'
})
export class SearchPersonByRolesComponent extends SearchPersonComponent {

  _roles: string[];

  ngOnInit() {
    super.ngOnInit();
    this.enableFilterCache("search-person-by-roles");
  }

  @Input() set roles(roles: string[] | string) {
    if (typeof roles === 'string') {
      roles = [roles];
    }
    this._roles = roles;
    this.update();
  }

  getFilters() {
    return super.getFilters().concat([FilterBuilder.in("roles", this._roles)]);
  }
}
