import {Component, OnDestroy, OnInit, input, ChangeDetectionStrategy, ChangeDetectorRef, computed, effect, signal, output, viewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {PersonService} from "@app/services/person.service";
import {Router} from "@angular/router";
import {Role} from "@app/pipes/role.pipe";
import {SearchCouncilComponent} from "../search/search-council/search-council.component";
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
      : ChangeDetectionStrategy.Eager
})
export class LifecycleGroupListComponent implements OnInit, OnDestroy {

  Role = Role;

  readonly role = input(undefined);
  readonly groups = input<LifecycleGroupDto[]>([]);
  readonly project = input<ProjectDto>(new ProjectDto());
  private subscriptions: Subscription[] = [];

  // Локальное состояние списка групп.
  // Важно: НЕ мутируем входной `groups()` (signal input), иначе возможны побочные эффекты у родителя/циклы.
  readonly groupsState = signal<LifecycleGroupDto[]>([]);

  private _lastGroupsRef: LifecycleGroupDto[] | undefined;

  readonly onChanged = output<any>();
  readonly onReplyChanged = output<ProjectDto>();

  readonly searchCouncilComponent = viewChild(SearchCouncilComponent);

  constructor(private _plainService: PersonService,
              private _router: Router,
              private _projectService: ProjectService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  private readonly groupsEffect = effect(() => {
    const groups = this.groups();
    if (Object.is(this._lastGroupsRef, groups)) {
      return;
    }
    this._lastGroupsRef = groups;
    // Делаем копию массива, чтобы дальнейшие изменения были локальными и иммутабельными.
    this.groupsState.set([...(groups ?? [])]);
  });

  changed() {
    this.onChanged.emit(this.groupsState());
  }

  replyChanged(project: ProjectDto){
    this.onReplyChanged.emit(project);
  }

  readonly canEditGroups = computed(() => {
    const project = this.project();
    const role = this.role();
    return (project.state === 'ON_CHECKING' && role === Role.GKNT_WORKER) ||
      (project.state === 'ON_DEPARTMENT_SIGNING' && role === Role.GKNT_DEPARTMENT_CHAIRMAN);
  });

  onSelectedCouncil($event) {
    this.subscriptions.push(
      this._projectService.attachCouncil(this.project(), $event.id).subscribe(res => {
        this.groupsState.set([...this.groupsState(), res]);
        this.searchCouncilComponent()?.hide();
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
    const next = this.groupsState().filter(g => g !== group);
    this.groupsState.set(next);
    this.changed();
    this.cdr?.markForCheck?.();
  }
}
