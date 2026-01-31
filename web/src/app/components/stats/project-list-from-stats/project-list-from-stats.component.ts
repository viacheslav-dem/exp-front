import {ChangeDetectionStrategy, Component, output, signal, viewChild} from "@angular/core";
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

    // Используем signals вместо обычных свойств для автоматического обновления UI
    projects = signal<ProjectDto[]>([]);
    countProjects = signal<number>(0);
    isDisplayPage = false;

    type: string;
    councilId: number;
    startOfMonth: number;
    endOfMonth: number;
    period = signal<string>('');

    SortClass = SortClass;
    sortDirection = signal<Direction>(Direction.ASC);
    readonly selected = output<ProjectDto>();
    searchProjectModal = viewChild<ModalComponent>('searchModal');

    constructor(protected service: ProjectService,
                private router: Router) {
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
        // Базовый класс FilterAndPages вызывает loadPage() при update()
        // Выбираем правильный метод загрузки в зависимости от типа
        if (this.type === "expired") {
            this.loadExpiredPage();
        } else if (this.type === "on_examination") {
            this.loadOnExaminationPage();
        }
    }

    private loadExpiredPage() {
        if (this.isDisplayPage) {
            this.period.set(dayjs(this.startOfMonth).startOf('month').locale('ru').format('MMMM YYYY'));
            this.setLoading(true);
            
            this.service.getExpiredProjectList(
                this.councilId, this.startOfMonth, this.endOfMonth, this._searchRequest
            ).subscribe({
                next: (res) => {
                    this._page = res;
                    this.projects.set(res.content);
                    this.countProjects.set(res.totalElements);
                    this.setLoading(false);
                    this.searchProjectModal()?.show();
                },
                error: () => {
                    this.setLoading(false);
                }
            });
        }
    }

    private loadOnExaminationPage() {
        if (this.isDisplayPage) {
            this.period.set(dayjs(this.startOfMonth).startOf('month').locale('ru').format('MMMM YYYY'));
            this.setLoading(true);
            
            this.service.getOnExaminationProjectList(
                this.councilId, this.startOfMonth, this.endOfMonth, this._searchRequest
            ).subscribe({
                next: (res) => {
                    this._page = res;
                    this.projects.set(res.content);
                    this.countProjects.set(res.totalElements);
                    this.setLoading(false);
                    this.searchProjectModal()?.show();
                },
                error: () => {
                    this.setLoading(false);
                }
            });
        }
    }

    getSortOrders() {
        return [new SortOrder("title", this.sortDirection())];
    }

    changeSort() {
        this.sortDirection.update(current => switchDirection(current, false));
        this.update();
    }

    show(type, councilId, startOfMonth, endOfMonth) {
        this.type = type;
        this.councilId = councilId;
        this.startOfMonth = startOfMonth;
        this.endOfMonth = endOfMonth;
        this.isDisplayPage = true;
        
        // Вызываем соответствующий метод загрузки
        if (type === "expired") {
            this.loadExpiredPage();
        } else if (type === "on_examination") {
            this.loadOnExaminationPage();
        }
    }

    hide() {
        this.searchProjectModal()?.hide();
    }

    openNewTab(event: MouseEvent, id: number) {
        // Отмените контекстное меню по умолчанию
        event.preventDefault();

        // Откройте страницу в новой вкладке
        window.open(`/projects/${id}`, '_blank');
    }
}