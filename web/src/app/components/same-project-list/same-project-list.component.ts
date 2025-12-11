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

    readonly sameProjects = input<ProjectDto[]>([]);
    _sameProjects: ProjectDto[] = [];
    readonly title = input<string>('');
    _title: string = '';

    get sameProjectsValue(): ProjectDto[] {
        return this._sameProjects.length > 0 ? this._sameProjects : this.sameProjects();
    }

    get titleValue(): string {
        return this._title || this.title();
    }

    set titleValue(value: string) {
        this._title = value;
    }

    getSameProjects() {
        this._projectService.getTheSameProjectsByTitle(this.titleValue).subscribe(value => {
            this._sameProjects = value;
        })
    }

}
