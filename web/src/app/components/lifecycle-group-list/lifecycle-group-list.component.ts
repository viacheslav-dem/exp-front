import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PersonService} from "@app/services/person.service";
import {Router} from "@angular/router";
import {Role} from "@app/pipes/role.pipe";
import {SearchCouncilComponent} from "../search/search-council/search-council.component";
import {ProjectLifecycleDto} from "@app/dto/ProjectLifecycleDto";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {ProjectService} from "@app/services/project.service";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
  selector: 'app-lifecycle-group-list',
  templateUrl: './lifecycle-group-list.component.html',
  styles: [`
      .lifecycle-group-item:not(:last-child) {
          margin-bottom: 1rem;
      }
  `]
})
export class LifecycleGroupListComponent implements OnInit {

  Role = Role;

  @Input() role;
  @Input() groups: LifecycleGroupDto[] = [];
  @Input() project: ProjectDto = new ProjectDto();

  @Output() onChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onReplyChanged: EventEmitter<ProjectDto> = new EventEmitter<ProjectDto>();

  @ViewChild(SearchCouncilComponent, { static: false }) searchCouncilComponent: SearchCouncilComponent;

  constructor(private _plainService: PersonService,
              private _router: Router,
              private _projectService: ProjectService) {
  }

  ngOnInit() {
  }

  changed() {
    this.onChanged.emit(this.groups);
  }

  replyChanged(project: ProjectDto){
    this.onReplyChanged.emit(project);
  }

  canEditGroups() {
    return this.project.state == 'ON_CHECKING' && this.role == Role.GKNT_WORKER ||
      this.project.state == 'ON_DEPARTMENT_SIGNING' && this.role == Role.GKNT_DEPARTMENT_CHAIRMAN;
  }

  onSelectedCouncil($event) {
    this._projectService.attachCouncil(this.project, $event.id).subscribe(res => {
      this.groups.push(res);
      this.searchCouncilComponent.hide();
      this.changed();
    });
  }

  deleteGroup(group) {
    this.groups.splice(this.groups.indexOf(group), 1);
    this.changed();
  }
}
