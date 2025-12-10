import {Component, input} from "@angular/core";
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

    readonly sameProjectsInput = input<ProjectDto[]>([]);
    _sameProjects: ProjectDto[] = [];
    readonly titleInput = input<string>('');
    _title: string = '';

    get sameProjects(): ProjectDto[] {
        return this._sameProjects.length > 0 ? this._sameProjects : this.sameProjectsInput();
    }

    get title(): string {
        return this._title || this.titleInput();
    }

    set title(value: string) {
        this._title = value;
    }

    getSameProjects() {
        this._projectService.getTheSameProjectsByTitle(this.title).subscribe(value => {
            this._sameProjects = value;
        })
    }

}
