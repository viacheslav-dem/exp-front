import {
    Component,
    ChangeDetectionStrategy,
    signal,
    computed,
    effect,
    ChangeDetectorRef,
    DestroyRef,
    inject,
    ViewChild,
    ElementRef
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
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
import {Pagination} from "app/components/common-components/page-and-filter/model/Pagination";
import {forkJoin, of, Subject} from "rxjs";
import {catchError, switchMap} from "rxjs/operators";
import {SectionPlainDto} from "@app/dto/SectionPlainDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent extends FilterAndPages<ProjectLiDto> {



    Role = Role; // enum for template
    projects = signal<ProjectLiDto[]>([]);
    role = signal<string>('');
    groups = signal<GroupStateDto[]>([]);
    showGroup = signal<boolean>(false);
    showFilter = signal<boolean>(false); // Для скрытия фильтров на мобильных
    selectedGroup = signal<string | null>(null);
    availableSections = signal<SectionPlainDto[]>([]);
    
    private readonly councilsChange$ = new Subject<any[]>();
    protected readonly ProjectState = ProjectState;
    /** Мутабельный набор выбранных id (источник истины для projectsList и API). */
    selectedProjectIds: Set<number> = new Set();
    /** Реактивная копия для шаблона и computed — обновляется при add/delete. */
    readonly selectedProjectIdsSet = signal<ReadonlySet<number>>(new Set());

    @ViewChild('sendIdListModal', { static: false }) sendIdListModal: ModalComponent;
    @ViewChild('masterGroupingCheckbox', { static: false }) masterGroupingCheckbox: ElementRef<HTMLInputElement> | null = null;

    /** Проекты на текущей странице со статусом «На визировании» (ON_SIGNING или ON_FINAL_SIGNING). */
    readonly onSigningOnPage = computed(() =>
        this.projects().filter(p =>
            p.state === ProjectState.ON_SIGNING || p.state === ProjectState.ON_FINAL_SIGNING
        )
    );

    /** Все такие проекты на странице выбраны. */
    readonly isAllOnSigningSelected = computed(() => {
        const list = this.onSigningOnPage();
        const sel = this.selectedProjectIdsSet();
        return list.length > 0 && list.every(p => sel.has(p.id));
    });

    /** Часть таких проектов выбрана (для indeterminate общего чекбокса). */
    readonly isSomeOnSigningSelected = computed(() =>
        this.onSigningOnPage().some(p => this.selectedProjectIdsSet().has(p.id))
    );

    constructor(private _projectService: ProjectService,
                private _authService: AuthService,
                private _dataService: DataService,
                private _councilPipe: CouncilPipe,
                private _route: ActivatedRoute,
                private _router: Router,
                private cdr: ChangeDetectorRef,
                private _toasty: GlobalToastyService) {
        super();
        // Обновлять indeterminate общего чекбокса при изменении выбора или списка (без ngAfterViewChecked на каждом CD).
        effect(() => {
            this.isAllOnSigningSelected();
            this.isSomeOnSigningSelected();
            this.updateMasterCheckboxIndeterminate();
        });
    }

    projectsList: ProjectLiDto[] = [];
    /** Состояние загрузки при отправке (в ГЭС и/или заказчику). */
    readonly sending = signal<boolean>(false);

    /**
     * Выбранные к отправке в ГЭС (ON_SIGNING без уже подготовленного письма о возврате заказчику).
     * Объекты ON_SIGNING с hasDecisionDocument = true уже решено вернуть заказчику без экспертизы
     * (см. project-info: кнопки "Отправить письмо заказчику" против "Отправить в ГЭС") -
     * их нельзя отправлять на экспертизу, у них нет активных групп ГЭС.
     */
    getProjectsListToGes(): ProjectLiDto[] {
        return this.projectsList.filter(p => p.state === ProjectState.ON_SIGNING && !p.hasDecisionDocument);
    }

    /** ON_SIGNING с уже подготовленным письмом о возврате заказчику без экспертизы. */
    private getProjectsListToReturn(): ProjectLiDto[] {
        return this.projectsList.filter(p => p.state === ProjectState.ON_SIGNING && !!p.hasDecisionDocument);
    }

    /** ON_FINAL_SIGNING — завершение проекта, отправка результатов заказчику. */
    private getProjectsListToFinish(): ProjectLiDto[] {
        return this.projectsList.filter(p => p.state === ProjectState.ON_FINAL_SIGNING);
    }

    /** Выбранные к отправке заказчику: завершение (ON_FINAL_SIGNING) или возврат без экспертизы (ON_SIGNING + письмо). */
    getProjectsListToCustomer(): ProjectLiDto[] {
        return [...this.getProjectsListToFinish(), ...this.getProjectsListToReturn()];
    }

    showModal() {
        this.sendIdListModal.show();
    }

    /**
     * Отправляет выбранные объекты массовыми запросами: в ГЭС (ON_SIGNING),
     * завершённые заказчику (ON_FINAL_SIGNING) и возврат заказчику без экспертизы (ON_SIGNING + письмо).
     */
    sendSelected() {
        const toGes = this.getProjectsListToGes();
        const toFinish = this.getProjectsListToFinish();
        const toReturn = this.getProjectsListToReturn();
        if (toGes.length === 0 && toFinish.length === 0 && toReturn.length === 0) {
            return;
        }
        this.sending.set(true);
        const gesIds = toGes.map(p => p.id);
        const finishIds = toFinish.map(p => p.id);
        const returnIds = toReturn.map(p => p.id);
        const gesObs = gesIds.length
            ? this._projectService.sendAllOnExpertExamination(gesIds)
            : of(null);
        const finishObs = finishIds.length
            ? this._projectService.sendAllFinished(finishIds)
            : of(null);
        const returnObs = returnIds.length
            ? this._projectService.sendAllReturned(returnIds)
            : of(null);
        forkJoin([gesObs, finishObs, returnObs]).subscribe({
            next: () => {
                this.sending.set(false);
                this.projectsList = [];
                this.selectedProjectIds.clear();
                this.selectedProjectIdsSet.set(new Set());
                this.loadPage();
                const parts: string[] = [];
                if (gesIds.length) parts.push('в ГЭС');
                if (finishIds.length || returnIds.length) parts.push('заказчику');
                this._toasty.success('Объекты отправлены ' + parts.join(' и ') + '.');
                this.closeModal();
            },
            error: (err) => {
                this.sending.set(false);
                this._toasty.err(err?.status ?? 0, 'Ошибка на сервере. Пожалуйста, обратитесь к администратору.');
                this.cdr.markForCheck();
            }
        });
    }

    addIdToList(project: ProjectLiDto) {
        if (!this.selectedProjectIds.has(project.id)) {
            this.selectedProjectIds.add(project.id);
            this.projectsList.push(project);
            this.selectedProjectIdsSet.set(new Set(this.selectedProjectIds));
        }
    }

    deleteIdFromList(project: ProjectLiDto) {
        if (this.selectedProjectIds.has(project.id)) {
            this.selectedProjectIds.delete(project.id);
            this.projectsList = this.projectsList.filter(p => p.id !== project.id);
            this.selectedProjectIdsSet.set(new Set(this.selectedProjectIds));
            this.cdr.markForCheck();
        }
    }

    /**
     * Обновляет состояние indeterminate у общего чекбокса «выбрать все».
     */
    updateMasterCheckboxIndeterminate(): void {
        const el = this.masterGroupingCheckbox?.nativeElement;
        if (!el) return;
        const some = this.isSomeOnSigningSelected();
        const all = this.isAllOnSigningSelected();
        el.indeterminate = some && !all;
    }

    /**
     * Обработчик общего чекбокса «выбрать все объекты на визировании на странице».
     */
    onSelectAllOnSigningChange(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;
        const list = this.onSigningOnPage();
        if (checked) {
            list.forEach(p => this.addIdToList(p));
        } else {
            list.forEach(p => this.deleteIdFromList(p));
        }
        this.cdr.markForCheck();
    }

    /**
     * Обработчик чекбокса «добавить в группировку» для gknt_chairman (проекты on_signing).
     */
    onGroupingCheckboxChange(project: ProjectLiDto, event: Event) {
        const checked = (event.target as HTMLInputElement).checked;
        if (checked) {
            this.addIdToList(project);
        } else {
            this.deleteIdFromList(project);
        }
        this.cdr.markForCheck();
    }

    closeModal() {
        if (this.sendIdListModal){
            this.sendIdListModal.hide();
        }
        this.sending.set(false);
    }

    ngOnInit() {
        this.role.set(this._authService.getCurrRole());

        const states = [
            {name: 'Черновик', value: [ProjectState.ROUGH]},
            {name: 'Новый', value: [ProjectState.NEW]},
            // {name: 'В подразделении ГКНТ', value: [ProjectState.ON_CHECKING]},
            {name: 'В отделе БелИСА', value: [ProjectState.ON_CHECKING]},
            {
                // name: 'На подписи в подразделении ГКНТ',
                name: 'На подписи в отделе БелИСА',
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
            SearchField.multiSelect('groups.lifecycles.section', [], section => section.name)
                .setSelectText('Выберите секцию').setSearchFilterEnabled(true)
                .setTitle('Секция'),
            SearchField.datePeriod('stateStartDate').setTitle('Дата последнего изменения')
                .setPlaceholder('Выбрать период...')
                .setSortable(true).setSortDirection(Direction.DESC),
            // SearchField.datePeriod('registerDate').setTitle('Дата регистрации в ГКНТ')
            SearchField.datePeriod('registerDate').setTitle('Дата регистрации в БелИСА')
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
        
        // ВАЖНО: enableFilterCache должен вызываться ДО подписки на queryParams,
        // чтобы установить _filterCachePageName для корректной работы защиты в update()
        this.enableFilterCache("project-list");
        
        // Инициализируем фильтр секций
        this.initializeSectionFilter();
        
        // Инициализируем подписку на изменения ГЭС для загрузки секций
        this.initializeSectionsSubscription();
        
        // Используем takeUntilDestroyed для автоматической отписки
        this._dataService.getOrgs()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (orgs) => {
                    const field = this.getSearchField('customer.org');
                    field.setItems(orgs);
                    // Восстанавливаем выбранные значения из кэша после загрузки каталога
                    if (field.value && Array.isArray(field.value) && field.value.length > 0) {
                        (field as any).setSelectedValues(field.value);
                        // Обновляем массив полей для триггера обновления в FilterComponent
                        this._searchFields = [...this._searchFields];
                    }
                    this.cdr.markForCheck();
                }
            });
        
        this._dataService.getCouncils()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (councils) => {
                    const field = this.getSearchField('groups.council');
                    field.setItems(councils);
                    // Восстанавливаем выбранные значения из кэша после загрузки каталога
                    if (field.value && Array.isArray(field.value) && field.value.length > 0) {
                        (field as any).setSelectedValues(field.value);
                        // Обновляем массив полей для триггера обновления в FilterComponent
                        this._searchFields = [...this._searchFields];
                        // Обновляем секции на основе выбранных ГЭС из кэша
                        this.loadSectionsForCouncils(field.value);
                    } else {
                        // Если ГЭС не выбраны, очищаем фильтр секций
                        this.clearSectionFilter();
                    }
                    this.cdr.markForCheck();
                }
            });
        
        this._projectService.getGroups(this._authService.getCurrRole())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.groups.set(res);
                }
            });
        
        // Подписка на изменения query-параметров (включая первую загрузку)
        // Вызывается ПОСЛЕ enableFilterCache, чтобы _filterCachePageName был установлен
        this._route.queryParams
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (params) => {
                    const pageParam = params['page'];
                    const pageFromRoute = pageParam != null ? parseInt(pageParam, 10) : NaN;

                    if (!isNaN(pageFromRoute) && pageFromRoute > 0) {
                        // pagination.page используется пагинатором (1-based)
                        const next = new Pagination(this._pagination?.itemsPerPage);
                        next.page = pageFromRoute;
                        this._pagination = next;
                        // paging.page уходит на бэкенд (0-based)
                        this._searchRequest.paging.page = pageFromRoute - 1;
                    } else {
                        // если параметр отсутствует или некорректен — считаем, что страница 1
                        const next = new Pagination(this._pagination?.itemsPerPage);
                        next.page = 1;
                        this._pagination = next;
                        this._searchRequest.paging.page = 0;
                    }

                    this.update();
                }
            });
    }

    loadPage() {
        this._searchRequest.group = this.selectedGroup();
        this._projectService.getPage(this._searchRequest)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this._page = res; // Обычное свойство, используется в шаблоне
                    this.projects.set(res.content); // Сигнал, автоматически триггерит change detection
                    this._projectService.getGroups(this._authService.getCurrRole())
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe({
                            next: (groupsRes) => {
                                this.groups.set(groupsRes); // Сигнал, автоматически триггерит change detection
                            }
                        });
                    this.setLoading(false); // Обычное свойство _loading, используется в шаблоне
                    // markForCheck нужен: _page и _loading - обычные свойства, используются в шаблоне
                    this.cdr.markForCheck();
                },
                error: () => {
                    this.setLoading(false); // Обычное свойство _loading, используется в шаблоне
                    this.cdr.markForCheck();
                }
            });
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

    override onFilterChanged() {
        // Обновляем секции при изменении фильтра ГЭС
        const councilField = this.getSearchField('groups.council');
        const selectedCouncils = councilField?.value;
        if (selectedCouncils && Array.isArray(selectedCouncils) && selectedCouncils.length > 0) {
            this.loadSectionsForCouncils(selectedCouncils);
        } else {
            this.clearSectionFilter();
        }
        super.onFilterChanged();
    }

    /**
     * Инициализирует фильтр секций: устанавливает пустой список и placeholder "Выберите секцию"
     */
    private initializeSectionFilter(): void {
        const sectionField = this.getSearchField('groups.lifecycles.section');
        sectionField.setItems([]);
        sectionField.setSelectText('Выберите секцию');
    }

    /**
     * Загружает секции для выбранных ГЭС и обновляет фильтр секций
     * Использует switchMap для предотвращения race conditions при быстрой смене ГЭС
     */
    private loadSectionsForCouncils(councils: any[]): void {
        // Отправляем новые выбранные ГЭС в поток для обработки
        this.councilsChange$.next(councils);
    }

    /**
     * Инициализирует подписку на изменения ГЭС для загрузки секций
     */
    private initializeSectionsSubscription(): void {
        this.councilsChange$
            .pipe(
                // switchMap отменяет предыдущий запрос при новом изменении ГЭС
                switchMap((councils: any[]) => {
                    // Проверяем валидность входных данных
                    if (!councils || !Array.isArray(councils) || councils.length === 0) {
                        // Возвращаем специальный маркер для очистки фильтра
                        return of(null);
                    }

                    // Фильтруем только валидные ГЭС с id
                    const validCouncils = councils.filter((council: any) => 
                        council && (typeof council.id === 'number' || typeof council.id === 'string')
                    );

                    if (validCouncils.length === 0) {
                        // Возвращаем специальный маркер для очистки фильтра
                        return of(null);
                    }

                    // Загружаем секции для каждого валидного ГЭС
                    const sectionObservables = validCouncils.map((council: any) => 
                        this._dataService.getSections(council.id).pipe(
                            catchError(() => of([]))
                        )
                    );

                    return forkJoin(sectionObservables);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (sectionsArrays) => {
                    const sectionField = this.getSearchField('groups.lifecycles.section');
                    
                    // Если sectionsArrays === null, значит нужно очистить фильтр
                    if (sectionsArrays === null) {
                        this.clearSectionFilter();
                        return;
                    }
                    
                    // Объединяем все секции из выбранных ГЭС и убираем дубликаты
                    const allSections = sectionsArrays.flat().filter((section, index, self) => 
                        section && section.id && index === self.findIndex(s => s && s.id === section.id)
                    );
                    
                    // Обновляем доступные секции и поле фильтра
                    this.availableSections.set(allSections);
                    sectionField.setItems(allSections);
                    sectionField.setSelectText('Выбрать секцию');
                    
                    // Валидируем и восстанавливаем выбранные значения из кэша
                    this.restoreSectionFilterFromCache(sectionField, allSections);
                    
                    this.cdr.markForCheck();
                }
            });
    }

    /**
     * Восстанавливает выбранные значения фильтра секций из кэша
     * По аналогии с восстановлением значений для других фильтров
     */
    private restoreSectionFilterFromCache(sectionField: SearchField, availableSections: SectionPlainDto[]): void {
        const selectedSections = sectionField?.value;
        
        if (selectedSections && Array.isArray(selectedSections)) {
            // Фильтруем только валидные секции (которые есть в доступных)
            const validSections = selectedSections.filter((selected: any) =>
                availableSections.some(s => s.id === selected.id)
            );
            
            // Если некоторые секции стали невалидными, обновляем значение
            if (validSections.length !== selectedSections.length) {
                sectionField.value = validSections.length > 0 ? validSections : null;
            }
            
            // Восстанавливаем выбранные значения из кэша после загрузки каталога
            if (sectionField.value && Array.isArray(sectionField.value) && sectionField.value.length > 0) {
                (sectionField as any).setSelectedValues(sectionField.value);
                this._searchFields = [...this._searchFields];
            }
        }
    }

    /**
     * Очищает фильтр секций и устанавливает начальное состояние
     * По аналогии с очисткой других фильтров
     */
    private clearSectionFilter(): void {
        const sectionField = this.getSearchField('groups.lifecycles.section');
        sectionField.setItems([]);
        sectionField.value = null;
        sectionField.selectedItems = [];
        sectionField.setSelectText('Выберите секцию');
        this.availableSections.set([]);
        this._searchFields = [...this._searchFields];
        this.cdr.markForCheck();
    }

}
