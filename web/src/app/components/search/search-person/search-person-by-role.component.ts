import {ChangeDetectionStrategy, Component, effect, input} from '@angular/core';
import {SearchPersonComponent} from "app/components/search/search-person/search-person.component";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-search-person-by-roles',
    templateUrl: './search-person.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.search) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Eager
})
export class SearchPersonByRolesComponent extends SearchPersonComponent {

  _roles: string[];
  readonly roles = input<string[] | string | undefined>(undefined);
  private readonly _rolesEffect = effect(() => {
    const roles = this.roles();
    const normalized = (typeof roles === 'string')
      ? [roles]
      : (roles ?? []);
    this._roles = normalized;
    this.update();
    this.cdr?.markForCheck?.();
  });

  ngOnInit() {
    super.ngOnInit();
    this.enableFilterCache("search-person-by-roles");
  }

  getFilters() {
    return super.getFilters().concat([FilterBuilder.in("roles", this._roles)]);
  }
}
