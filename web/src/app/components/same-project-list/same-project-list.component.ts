import {Component, Input} from "@angular/core";
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectService} from "@app/services/project.service";

@Component({
    selector: 'app-same-project-list',
    templateUrl: './same-project-list.component.html',
    standalone: false
})

export class SameProjectListComponent {

    constructor(private _projectService: ProjectService) {
    }

    @Input() sameProjects: ProjectDto[] = [];
    @Input() title: string = '';

    getSameProjects() {
        this._projectService.getTheSameProjectsByTitle(this.title).subscribe(value => {
            this.sameProjects = value;
        })
    }

}
