import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, input, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {PersonService} from "@app/services/person.service";
import {Router} from "@angular/router";
import {Role} from "@app/pipes/role.pipe";
import {SearchCouncilComponent} from "../search/search-council/search-council.component";
import {ProjectLifecycleDto} from "@app/dto/ProjectLifecycleDto";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {ProjectService} from "@app/services/project.service";
import {ProjectDto} from "@app/dto/ProjectDto";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-lifecycle-group-list',
    templateUrl: './lifecycle-group-list.component.html',
    styleUrls: ['lifecycle-group-list.component.scss'],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectDetail)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class LifecycleGroupListComponent implements OnInit, OnDestroy {

  Role = Role;

  readonly role = input(undefined);
  readonly groups = input<LifecycleGroupDto[]>([]);
  readonly project = input<ProjectDto>(new ProjectDto());
  private subscriptions: Subscription[] = [];

  @Output() onChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onReplyChanged: EventEmitter<ProjectDto> = new EventEmitter<ProjectDto>();

  @ViewChild(SearchCouncilComponent, { static: false }) searchCouncilComponent: SearchCouncilComponent;

  constructor(private _plainService: PersonService,
              private _router: Router,
              private _projectService: ProjectService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  changed() {
    this.onChanged.emit(this.groups());
  }

  replyChanged(project: ProjectDto){
    this.onReplyChanged.emit(project);
  }

  canEditGroups() {
    const project = this.project();
    const role = this.role();
    return (project.state === 'ON_CHECKING' && role === Role.GKNT_WORKER) ||
      (project.state === 'ON_DEPARTMENT_SIGNING' && role === Role.GKNT_DEPARTMENT_CHAIRMAN);
  }

  onSelectedCouncil($event) {
    this.subscriptions.push(
      this._projectService.attachCouncil(this.project(), $event.id).subscribe(res => {
        this.groups().push(res);
        this.searchCouncilComponent.hide();
        this.changed();
        this.cdr?.markForCheck?.();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  deleteGroup(group) {
    this.groups().splice(this.groups().indexOf(group), 1);
    this.changed();
    this.cdr?.markForCheck?.();
  }
}
