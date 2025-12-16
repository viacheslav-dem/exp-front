import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, input} from '@angular/core';
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
    changeDetection: environment.features.onPush.projectLi ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
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
    if (this.role == Role.EXPERT || this.role == Role.GKNT_WORKER || this.role == Role.GKNT_CHAIRMAN
      || this.role == Role.GKNT_DEPARTMENT_CHAIRMAN || this.role == Role.BELISA_EDIT) {
      this.getBelisaContacts(this.project);
    }
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


  @Input() set item(project: ProjectLiDto) {
    this._projectService.prepareProject(project);
    this.project = project;
  }

  getBelisaContacts(project: ProjectLiDto) {
    this._projectService.getBelisaContacts(project).subscribe(res => {
      this.belisaPersons = res;
      this.cdr?.markForCheck?.();
    });
  }
}
