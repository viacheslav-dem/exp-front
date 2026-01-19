import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, effect, input} from '@angular/core';
import {ProjectStateBadge} from "@app/pipes/project-state.pipe";
import {ProjectService} from "@app/services/project.service";
import {ProjectLiDto} from "@app/dto/ProjectLiDto";
import {PersonDto} from "@app/dto/PersonDto";
import {Role} from "@app/pipes/role.pipe";
import {AuthService} from "@app/services/auth.service";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-project-li',
    templateUrl: './project-li.component.html',
    styleUrls: ['project-li.component.scss'],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class ProjectLiComponent implements OnInit {

  environment = environment;
  ProjectStateBadge = ProjectStateBadge;
  project: ProjectLiDto;
  belisaPersons: PersonDto[] = [];
  role: string;
  Role = Role;


  public readonly baseItemLink = input<string>('');
  public readonly group = input<string>(null);

  constructor(private _projectService: ProjectService,
              private _authService: AuthService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.role = this._authService.getCurrRole();
  }

  onNumberClick($event) {
    // do not open project page
    $event.stopPropagation();

    // auto select number for copy purpose
    let range = document.createRange();
    range.selectNodeContents($event.target);
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }


  readonly item = input<ProjectLiDto>(undefined);

  private readonly itemEffect = effect(() => {
    const project = this.item();
    if (!project) {
      return;
    }
    this._projectService.prepareProject(project);
    this.project = project;
    
    // Загружаем контакты когда проект установлен и роль соответствует условиям
    const currentRole = this._authService.getCurrRole();
    if (currentRole == Role.EXPERT || currentRole == Role.GKNT_WORKER || currentRole == Role.GKNT_CHAIRMAN
      || currentRole == Role.GKNT_DEPARTMENT_CHAIRMAN || currentRole == Role.BELISA_EDIT) {
      this.getBelisaContacts(project);
    }
  });

  getBelisaContacts(project: ProjectLiDto) {
    this._projectService.getBelisaContacts(project).subscribe(res => {
      this.belisaPersons = res;
      this.cdr?.markForCheck?.();
    });
  }
}
