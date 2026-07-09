import {ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, input, signal} from "@angular/core";
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectService} from "@app/services/project.service";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-same-project-list',
    templateUrl: './same-project-list.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.listsAndInfo) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Eager
})

export class SameProjectListComponent {

    constructor(private _projectService: ProjectService, private cdr: ChangeDetectorRef) {
    }

    readonly sameProjects = input<ProjectDto[]>([]);
    private readonly _sameProjects = signal<ProjectDto[]>([]);
    readonly title = input<string>('');
    private readonly _title = signal<string>('');

    readonly sameProjectsValue = computed(() => {
        const loaded = this._sameProjects();
        return loaded.length > 0 ? loaded : this.sameProjects();
    });

    readonly titleValue = computed(() => {
        const loaded = this._title();
        return loaded || this.title();
    });

    setTitle(value: string) {
        this._title.set(value ?? '');
    }

    getSameProjects() {
        this._projectService.getTheSameProjectsByTitle(this.titleValue()).subscribe(value => {
            this._sameProjects.set(value);
        })
    }

}
