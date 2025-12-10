import {Component} from '@angular/core';
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {Direction, SortOrder} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {ProjectLiDto} from "@app/dto/ProjectLiDto";
import {ProjectService} from "@app/services/project.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-project-list-filtered',
    templateUrl: './project-list-filtered.component.html',
    standalone: false
})
export class ProjectListFilteredComponent extends FilterAndPages<ProjectLiDto> {

  projects: ProjectLiDto[] = [];
  filterName: string;

  constructor(private _projectService: ProjectService,
              private _router: Router) {
    super();
  }

  ngOnInit() {
    if (!this._projectService.filter) {
      this._router.navigateByUrl('projects').then();
      return;
    }
    this._filters = [this._projectService.filter];
    this._sortOrders = [new SortOrder('stateStartDate', Direction.DESC)];
    this.filterName = this._projectService.filterName;
  }

  loadPage() {
    this._projectService.getPage(this._searchRequest).subscribe(res => {
      this._page = res;
      this.projects = res.content;
      this.setLoading(false);
    }, () => this.setLoading(false));
  }
}
