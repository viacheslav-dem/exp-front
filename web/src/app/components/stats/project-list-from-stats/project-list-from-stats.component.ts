import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, output} from "@angular/core";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {
    Direction,
    SortClass, SortOrder,
    switchDirection
} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {ProjectService} from "@app/services/project.service";
import {ProjectDto} from "@app/dto/ProjectDto";
import {Router} from "@angular/router";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import {environment} from "../../../../environments/environment";


@Component({
    selector: 'project-list-from-stats',
    templateUrl: 'project-list-from-stats.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.stats) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class ProjectListFromStatsComponent extends FilterAndPages<ProjectDto> {

    projects: ProjectDto[] = [];
    countProjects: number;
    isDisplayPage = false;

    type: string;
    councilId: number;
    startOfMonth: number;
    endOfMonth: number;
    period: string;

    SortClass = SortClass;
    sortDirection = Direction.ASC;
    readonly selected = output<ProjectDto>();
    @ViewChild('searchModal', { static: false }) searchProjectModal: ModalComponent;

    constructor(protected service: ProjectService,
                private router: Router,
                private cdr: ChangeDetectorRef) {
        super();
        this._searchFields = [SearchField.startsWith('title').setPlaceholder('Поиск по наименованию объекта экспертизы...')];
    }

    ngOnInit() {
        this.enableFilterCache("search-project");
    }

    onSelected(project) {

        let url = "projects/" + project.id;
        this.router.navigateByUrl(url).then();
    }

    loadPage() {
        if (this.isDisplayPage) {
            this.service.getExpiredProjectList(
                this.councilId, this.startOfMonth, this.endOfMonth, this._searchRequest
            ).subscribe(res => {
                this._page = res;
                this.projects = res.content;
                this.countProjects = res.totalElements;

                this.setLoading(false);
                this.cdr?.markForCheck?.();
            }, () => {
                this.setLoading(false);
                this.cdr?.markForCheck?.();
            });
            this.period = dayjs(this.startOfMonth).startOf('month').locale('ru').format('MMMM YYYY');
            this.searchProjectModal.show();
            this.cdr?.markForCheck?.();
        }
    }

    loadPageOnExamination() {
        if (this.isDisplayPage) {
            this.service.getOnExaminationProjectList(
                this.councilId, this.startOfMonth, this.endOfMonth, this._searchRequest
            ).subscribe(res => {
                this._page = res;
                this.projects = res.content;
                this.countProjects = res.totalElements;

                this.setLoading(false);
            }, () => this.setLoading(false));
            this.period = dayjs(this.startOfMonth).startOf('month').locale('ru').format('MMMM YYYY');
            this.searchProjectModal.show();
        }
    }

    getSortOrders() {
        return [new SortOrder("title", this.sortDirection)];
    }

    changeSort() {
        this.sortDirection = switchDirection(this.sortDirection, false);
        this.update();
    }

    show(type, councilId, startOfMonth, endOfMonth) {

        this.type = type;
        this.councilId = councilId;
        this.startOfMonth = startOfMonth;
        this.endOfMonth = endOfMonth;
        this.isDisplayPage = true;
        if(type == "expired")
            this.loadPage();
        else if (type == "on_examination")
            this.loadPageOnExamination();
    }

    hide() {
        this.searchProjectModal.hide();
    }

    openNewTab(event: MouseEvent, id: number) {
        // Отмените контекстное меню по умолчанию
        event.preventDefault();

        // Откройте страницу в новой вкладке
        window.open(`#/projects/${id}`, '_blank');
    }
}