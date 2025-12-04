import {Component, ChangeDetectionStrategy, signal, ChangeDetectorRef} from '@angular/core';
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {Direction, SortOrder} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {ProjectLiDto} from "@app/dto/ProjectLiDto";
import {ProjectService} from "@app/services/project.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-project-list-filtered',
    templateUrl: './project-list-filtered.component.html',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListFilteredComponent extends FilterAndPages<ProjectLiDto> {

  projects = signal<ProjectLiDto[]>([]);
  filterName = signal<string | undefined>(undefined);

  constructor(private _projectService: ProjectService,
              private _router: Router,
              private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    if (!this._projectService.filter) {
      this._router.navigateByUrl('projects').then();
      return;
    }
    this._filters = [this._projectService.filter];
    this._sortOrders = [new SortOrder('stateStartDate', Direction.DESC)];
    this.filterName.set(this._projectService.filterName);
    this.update();
  }

  loadPage() {
    this._projectService.getPage(this._searchRequest).subscribe({
      next: (res) => {
        this._page = res;
        this.projects.set(res.content);
        this.setLoading(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.setLoading(false);
        this.cdr.markForCheck();
      }
    });
  }
}
