import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {SearchPersonComponent} from "app/components/search/search-person/search-person.component";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-search-person-by-roles',
    templateUrl: './search-person.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.search) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
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
    this.cdr?.markForCheck?.();
  }

  getFilters() {
    return super.getFilters().concat([FilterBuilder.in("roles", this._roles)]);
  }
}
