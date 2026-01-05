import {ChangeDetectionStrategy, ChangeDetectorRef, Component, input} from "@angular/core";
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectService} from "@app/services/project.service";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-same-project-list',
    templateUrl: './same-project-list.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.listsAndInfo) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})

export class SameProjectListComponent {

    constructor(private _projectService: ProjectService, private cdr: ChangeDetectorRef) {
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
            this.cdr?.markForCheck?.();
        })
    }

}
