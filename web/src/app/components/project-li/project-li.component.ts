import {Component, Input, OnInit, input} from '@angular/core';
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
    styles: [
        'a{color: inherit !important; text-decoration: none !important; display: block;}',
        'a:hover{color: inherit !important; text-decoration: none !important; cursor: pointer;}',
        '.project-list-item{transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); padding: 1rem 1.25rem; background-color: #ffffff; border: 1px solid rgba(0, 0, 0, 0.08);}',
        '.project-list-item:hover{background-color: #f8f9fa; transform: translateY(-2px); box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.15) !important; border-color: rgba(13, 110, 253, 0.25) !important;}',
        '.project-list-item.active{background-color: #e7f1ff; border-color: #0d6efd !important; box-shadow: 0 0.25rem 0.75rem rgba(13, 110, 253, 0.2) !important;}',
        '.project-list-item.alert-danger{border-color: rgba(220, 53, 69, 0.25);}',
        '.project-list-item.alert-danger:hover{background-color: #f8d7da; border-color: rgba(220, 53, 69, 0.4);}',
        '.project-list-item.alert-warning{border-color: rgba(255, 193, 7, 0.25);}',
        '.project-list-item.alert-warning:hover{background-color: #fff3cd; border-color: rgba(255, 193, 7, 0.4);}',
        '.project-list-item.alert-primary{border-color: rgba(13, 110, 253, 0.25);}',
        '.project-list-item.alert-primary:hover{background-color: #cfe2ff; border-color: rgba(13, 110, 253, 0.4);}',
        '.project-list-item .customer-name{word-break: break-word; overflow-wrap: break-word; hyphens: auto; line-height: 1.4;}'
    ],
    standalone: false
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
              private _authService: AuthService,) {
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
    this._projectService.getBelisaContacts(project).subscribe(res => this.belisaPersons = res);
  }
}
