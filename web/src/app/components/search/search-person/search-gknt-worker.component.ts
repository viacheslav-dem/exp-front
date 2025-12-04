import {Component, Input} from "@angular/core";
import {Role} from "app/pipes/role.pipe";
import {SearchPersonComponent} from "app/components/search/search-person/search-person.component";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";

@Component({
    selector: 'app-search-gknt-worker',
    templateUrl: './search-person.component.html',
    standalone: false
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
  }

  getFilters() {
    return super.getFilters().concat([
      FilterBuilder.equals('gkntDepartment', {id: this._gkntDepartmentId}),
      FilterBuilder.in("roles", [Role.GKNT_WORKER])
    ]);
  }
}
