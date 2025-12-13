import {Component, ChangeDetectionStrategy, OnDestroy, signal, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "@app/services/auth.service";
import {Role} from "@app/pipes/role.pipe";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {Catalog, DataService} from "@app/services/data.service";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {ProjectState} from "@app/pipes/project-state.pipe";
import dayjs from 'dayjs';
import {Operation} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import {ProjectLiDto} from "@app/dto/ProjectLiDto";
import {ProjectService} from "@app/services/project.service";
import {DateRange} from "@app/components/common-components/page-and-filter/model/Range";
import {CouncilPipe} from "@app/pipes/council.pipe";
import {GroupStateDto} from "@app/dto/GroupStateDto";
import {noveltyOptions} from "@app/components/document-form/document-blocks/novelty-block.component";
import {economicSignificanceOptions} from "@app/components/document-form/document-blocks/economic-significance-block.component";
import {resourcesSufficiencyOptions} from "@app/components/document-form/document-blocks/resources-sufficiency-block.component";
import {competenceSufficiencyOptions} from "@app/components/document-form/document-blocks/competence-sufficiency-block.component";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent extends FilterAndPages<ProjectLiDto> implements OnDestroy {

    Role = Role; // enum for template
    projects = signal<ProjectLiDto[]>([]);
    role = signal<string>('');
    groups = signal<GroupStateDto[]>([]);
    showGroup = signal<boolean>(false);
    showFilter = signal<boolean>(false); // Для скрытия фильтров на мобильных
    selectedGroup = signal<string | null>(null);
    private subscriptions: Subscription[] = [];

    constructor(private _projectService: ProjectService,
                private _authService: AuthService,
                private _dataService: DataService,
                private _councilPipe: CouncilPipe,
                private _route: ActivatedRoute,
                private _router: Router,
                private cdr: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        this.role.set(this._authService.getCurrRole());

        const states = [
            {name: 'Черновик', value: [ProjectState.ROUGH]},
            {name: 'Новый', value: [ProjectState.NEW]},
            {name: 'В подразделении ГКНТ', value: [ProjectState.ON_CHECKING]},
            {
                name: 'На подписи в подразделении ГКНТ',
                value: [
                    ProjectState.ON_DEPARTMENT_SIGNING,
                    ProjectState.ON_DEPARTMENT_FINAL_SIGNING
                ]
            },
            {name: 'На визировании', value: [ProjectState.ON_SIGNING, ProjectState.ON_FINAL_SIGNING]},
            {name: 'На экспертной оценке', value: [ProjectState.ON_EXPERT_EXAMINATION]},
            {name: 'На экспертизе', value: [ProjectState.ON_EXAMINATION]},
            {name: 'Рассмотрен', value: [ProjectState.ACCEPTED, ProjectState.REJECTED]},
            {name: 'Возвращён', value: [ProjectState.RETURNED]}
        ];

        this._searchFields = [
            SearchField.contains('title').setTitle('Наименование')
                .setPlaceholder('Поиск по наименованию...').setSortable(true),
            SearchField.startsWith('id').setTitle('Номер объекта')
                .setPlaceholder('Поиск по номеру объекта...'),

        ];
        if (this.role() === Role.BUREAU_CHAIRMAN) {
            this._searchFields.push(SearchField.startsWith('councilReferences.id.orderNumber')
                // .setSortable(true)
                .setTitle('Номер объекта внутри ГЭС')
                .setPlaceholder('Поиск по номеру объекта...'));
        }
        this._searchFields.push(...[SearchField.multiSelect('state', states, null, value => value.value)
            .setSelectText('Выбрать этап').setCheckAllEnabled(true)
            .setTitle('Этап экспертизы').setSortable(true),
            SearchField.multiSelect('groups.council', [], council => this._councilPipe.transform(council))
                .setSelectText('Выбрать ГЭС').setSearchFilterEnabled(true)
                .setTitle('ГЭС'),
            SearchField.datePeriod('stateStartDate').setTitle('Дата последнего изменения')
                .setPlaceholder('Выбрать период...')
                .setSortable(true).setSortDirection(Direction.DESC),
            SearchField.datePeriod('registerDate').setTitle('Дата регистрации в ГКНТ')
                .setPlaceholder('Выбрать период...')
                .setSortable(true).setSortDirection(Direction.DESC),
            SearchField.checkbox(this.getStateField(), 'С подходящим или нарушенным сроком', new DateRange(null, dayjs().valueOf()), null)
                .setOperation(Operation.RANGE),
            SearchField.multiSelect('code', Catalog.PROJECT_CODE, (code) => code.code)
                .setSearchFilterEnabled(true).setSelectText('Выбрать код')
                .setTitle('Код объекта экспертизы'),
            SearchField.datePeriod('period.start').setTitle('Начало периода реализации'),
            SearchField.datePeriod('period.end').setTitle('Окончание периода реализации'),
            SearchField.multiSelect('customer.org', [])
                .setSelectText('Выбрать организацию').setSearchFilterEnabled(true)
                .setTitle('Заказчик'),
            SearchField.startsWith('customer.personName.lastName').setTitle('Представитель заказчика')
                .setPlaceholder('Поиск по фамилии...'),
            SearchField.contains('executor').setTitle('Организация-исполнитель')
                .setPlaceholder('Поиск по исполнителю...'),
            SearchField.multiSelect('directions', Catalog.DIRECTION).setTitle('Приоритетные направления')
                .setPlaceholder('Поиск по направлениям...'),
            SearchField.multiSelect('socialEconomicGoals', Catalog.SOCIAL_ECONOMIC_GOAL).setTitle('Цели (приоритеты) социально-экономического развития')
              .setPlaceholder('Поиск по направлениям...'),
            SearchField.multiSelect('expertReviews.novelty', noveltyOptions).setTitle('Степень новизны')
              .setPlaceholder('Выбрать степень новизны'),
            SearchField.multiSelect('expertReviews.economicSignificance', economicSignificanceOptions).setTitle('Социально-экономическая значимость')
              .setPlaceholder('Выбрать значимость'),
            SearchField.multiSelect('expertReviews.resourcesSufficiency', resourcesSufficiencyOptions).setTitle('Достаточность материально-технической базы')
              .setPlaceholder('Выбрать достаточность базы'),
            SearchField.multiSelect('expertReviews.competenceSufficiency', competenceSufficiencyOptions).setTitle('Достаточность компетенции')
              .setPlaceholder('Выбрать достаточность компетенции'),
        ]);
        this.subscriptions.push(
            this._dataService.getOrgs().subscribe({
                next: (orgs) => {
                    this.getSearchField('customer.org').setItems(orgs);
                    this.cdr.markForCheck();
                }
            }),
            this._dataService.getCouncils().subscribe({
                next: (councils) => {
                    this.getSearchField('groups.council').setItems(councils);
                    this.cdr.markForCheck();
                }
            }),
            this._projectService.getGroups(this._authService.getCurrRole()).subscribe({
                next: (res) => {
                    this.groups.set(res);
                    this.cdr.markForCheck();
                }
            }),
            // Подписка на изменения query-параметров (включая первую загрузку)
            this._route.queryParams.subscribe({
                next: (params) => {
                    const pageParam = params['page'];
                    const pageFromRoute = pageParam != null ? parseInt(pageParam, 10) : NaN;

                    if (!isNaN(pageFromRoute) && pageFromRoute > 0) {
                        // pagination.page используется пагинатором (1-based)
                        this._pagination.page = pageFromRoute;
                        // paging.page уходит на бэкенд (0-based)
                        this._searchRequest.paging.page = pageFromRoute - 1;
                    } else {
                        // если параметр отсутствует или некорректен — считаем, что страница 1
                        this._pagination.page = 1;
                        this._searchRequest.paging.page = 0;
                    }

                    this.update();
                }
            })
        );
        this.enableFilterCache("project-list");
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    loadPage() {
        this._searchRequest.group = this.selectedGroup();
        this.subscriptions.push(
            this._projectService.getPage(this._searchRequest).subscribe({
                next: (res) => {
                    this._page = res;
                    this.projects.set(res.content);
                    this.subscriptions.push(
                        this._projectService.getGroups(this._authService.getCurrRole()).subscribe({
                            next: (groupsRes) => {
                                this.groups.set(groupsRes);
                                this.cdr.markForCheck();
                            }
                        })
                    );
                    this.setLoading(false);
                    this.cdr.markForCheck();
                },
                error: () => {
                    this.setLoading(false);
                    this.cdr.markForCheck();
                }
            })
        );
    }

    selectGroup(id: string) {
        if (this.selectedGroup() === id) {
            this.selectedGroup.set(null);
        } else {
            this.selectedGroup.set(id);
        }
        this.loadPage();
    }

    onPageChanged(pageRequest: PageRequest) {
        this._router.navigate([], {
            relativeTo: this._route,
            queryParams: {page: pageRequest.page + 1},
            queryParamsHandling: 'merge'
        });
        super.onPageChanged(pageRequest);
    }

    private getStateField() {
        switch (this._authService.getCurrRole()) {
            case Role.EXPERT:
                return 'expertReviews.stateEndDate';
            case Role.SECTION_ASSESSOR:
            case Role.SECTION_CHAIRMAN:
                return 'lifecycles.stateEndDate';
            case Role.BUREAU_ASSESSOR:
            case Role.BUREAU_CHAIRMAN:
                return 'groups.stateEndDate';
            default:
                return 'stateEndDate';
        }
    }


}
