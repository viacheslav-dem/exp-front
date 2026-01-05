import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {Role} from "app/pipes/role.pipe";
import {SearchPersonComponent} from "app/components/search/search-person/search-person.component";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-search-gknt-worker',
    templateUrl: './search-person.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.search) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class SearchGkntWorkerComponent extends SearchPersonComponent {

  _gkntDepartmentId: number;

  ngOnInit() {
    super.ngOnInit();
    this.enableFilterCache("search-gknt-worker");
  }

  @Input() set gkntDepartmentId(id: number) {
    this._gkntDepartmentId = id;
    this.update();
    this.cdr?.markForCheck?.();
  }

  getFilters() {
    return super.getFilters().concat([
      FilterBuilder.equals('gkntDepartment', {id: this._gkntDepartmentId}),
      FilterBuilder.in("roles", [Role.GKNT_WORKER])
    ]);
  }
}
