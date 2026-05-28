import {
    afterNextRender,
    Component,
    computed,
    effect,
    inject,
    Injector,
    OnInit,
    Signal,
    signal,
    untracked
} from "@angular/core";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {ManualSelectionRequestDto} from "@app/dto/ManualSelectionRequestDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {ProjectService} from "@app/services/project.service";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {DataService} from "@app/services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";
import {Pagination} from "@app/components/common-components/page-and-filter/model/Pagination";
import {ProjectDto} from "@app/dto/ProjectDto";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";
import {DialogResult} from "@app/components/dialogs/dialog-result";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";
import {ProjectReviewsExpertsDto} from "@app/dto/ProjectReviewsExpertsDto";
import {Page} from "@app/components/common-components/page-and-filter/model/Page";

@Component({
    selector: 'app-confirm-manual-selection',
    standalone: false,
    templateUrl: './confirm-manual-selection.component.html',
    styleUrls: ['confirm-manual-selection.component.scss']
})

export class ConfirmManualSelectionComponent extends FilterAndPages<ProjectDto> implements OnInit {

    showMobileFilters = false;

    readonly projects = signal<ProjectDto[]>([]);
    readonly hasProjects = computed(() => this.projects().length > 0);
    readonly filterResultText = signal<string | null>(null);

    // Флаг для предотвращения двойной загрузки при изменении страницы
    private _isPageChangeInProgress = false;

    // Текущая страница для предотвращения лишних обновлений
    private _currentPage = 0;

    // Флаг для отслеживания первой загрузки
    private _isInitialLoad = true;

    // Защита от гонок: игнорируем устаревшие ответы
    private _loadToken = 0;
    private _prefetchToken = 0;

    // Inject Injector для afterNextRender
    private readonly injector = inject(Injector);

    // Signal для queryParams (инициализируется в конструкторе)
    private readonly queryParamsSignal: Signal<Record<string, any>>;

    constructor(
        private _toasty: GlobalToastyService,
        private _projectService: ProjectService,
        private _dialogService: DialogService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _dataService: DataService
    ) {
        super();

        // Этот компонент не использует кэш фильтров из `FilterAndPages`.
        // Важно: иначе при наличии кэшей других страниц базовый guard может навсегда блокировать загрузку.
        this._initialLoadDone = true;

        // Подписка на изменения queryParams через toSignal для реактивности
        // Создаем в конструкторе после super(), так как toSignal требует injection context
        this.queryParamsSignal = toSignal(
            this._route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)),
            {initialValue: this._route.snapshot.queryParams}
        );

        // Effect для обработки изменений queryParams
        // Создаем в конструкторе, так как effect требует injection context
        effect(() => {
            const params = this.queryParamsSignal();
            // params может быть пустым объектом {}, но не null
            if (!params || typeof params !== 'object') return;

            // Пропускаем обновление, если загрузка уже началась из onPageChanged()
            if (this._isPageChangeInProgress) {
                this._isPageChangeInProgress = false;
                return;
            }

            const pageParam = params['page'];
            const pageFromRoute = pageParam != null ? parseInt(pageParam, 10) : NaN;
            const targetPage = !isNaN(pageFromRoute) && pageFromRoute > 0 ? pageFromRoute - 1 : 0;
            // При первой загрузке всегда обновляем, даже если страница не изменилась
            const isFirstLoad = this._isInitialLoad;
            if (isFirstLoad) {
                this._isInitialLoad = false;
            } else {
                // Оптимизация: пропускаем обновление, если страница не изменилась (только после первой загрузки)
                if (targetPage === this._currentPage && this._pagination.page === (targetPage + 1)) {
                    return;
                }
            }
            // Обновляем страницу в untracked блоке, чтобы не создавать лишние зависимости
            untracked(() => this.setPageState(targetPage));

            this.updateOptimized();
        });
    }

    ngOnInit() {
        this._searchFields = [
            SearchField.startsWith('id').setTitle('Рег. номер')
                .setPlaceholder('Поиск по номеру...').setNumericOnly(),
            SearchField.contains('title').setTitle('Наименование')
                .setPlaceholder('Поиск по наименованию...'),
            SearchField.multiSelect('customer.org', [])
                .setSelectText('Выбрать организацию').setSearchFilterEnabled(true)
                .setTitle('Заказчик экспертизы')
        ];

        this._dataService.getOrgs()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(orgs => {
                this.getSearchField('customer.org').setItems(orgs);
            });
    }

    private setPageState(targetPage0Based: number) {
        this._currentPage = targetPage0Based;
        // paging.page — 0-based для бэка
        this._searchRequest.paging.page = targetPage0Based;
        // pagination.page — 1-based для пагинатора
        const next = new Pagination(this._pagination?.itemsPerPage);
        next.page = targetPage0Based + 1;
        this._pagination = next;
    }

    // Оптимизированная версия update() без задержки в setLoading
    private updateOptimized() {
        // Подготавливаем запрос
        this.prepareRequest();
        // Показываем индикатор загрузки сразу, без задержки
        this.setLoading(true);
        // Начинаем загрузку данных немедленно
        this.loadPage();
    }

    protected loadPage() {
        const token = ++this._loadToken;
        const requestSnapshot = this._searchRequest;

        this._projectService.getAllRequestsForManualSelectionPage(requestSnapshot).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (res) => {
                // Игнорируем устаревший ответ (например, при быстром клике по страницам)
                if (token !== this._loadToken) {
                    return;
                }
                this._page = res;
                this.projects.set(res.content);
                // Обновляем текст счётчика: показываем только при активных фильтрах
                const hasFilters = this._searchFields.some(f => !f.isEmpty());
                this.filterResultText.set(hasFilters ? `Найдено: ${res.totalElements}` : null);
                this.setLoading(false);
                afterNextRender(() => {
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });
                }, {injector: this.injector});
            },
            error: (error) => {
                // Если это устаревшая загрузка — не «роняем» UI и не мигаем ошибками
                if (token !== this._loadToken) {
                    return;
                }
                this.setLoading(false);
                const errorMessage = error?.error || error?.message || 'Произошла ошибка при загрузке данных';
                this._toasty.error(errorMessage);
            }
        })
    }

    confirmRequest(project: ProjectDto, request: ManualSelectionRequestDto) {
        this._dialogService.showConfirmDialog('Одобрение заявки',
            `Одобрить заявку на ручной выбор эксперта на объект экспертизы "${project.title}"?`,
            'Пожалуйста, проверьте данные об эксперте, поскольку отменить действие будет невозможно.')
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {

            request.onConfirmation = false;
            request.isConfirmed = true;

            this._projectService.updateRequestForManualSelection(request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: (res) => {
                    this.handleRequestUpdate(project)
                    this._toasty.success("Заявка одобрена.");
                },
                error: (error) => {
                    const errorMessage = error?.error || error?.message || 'Произошла ошибка при подтверждении';
                    this._toasty.error(errorMessage);
                }
            })
        })
    }

    rejectRequest(project: ProjectDto, request: ManualSelectionRequestDto) {
        this._dialogService.showConfirmDialogWithFields(
            [new ConfirmDialogField<string>('reason', 'Причина отклонения')],
            'Отклонение заявки',
            `Отклонить  заявку на ручной выбор эксперта на объект экспертизы "${project.title}"?`,
            'Пожалуйста, проверьте данные об эксперте, поскольку отменить действие будет невозможно.')
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe((dlgResult: DialogResult<any>) => {
            if (dlgResult.value.reason == null || dlgResult.value.reason == '') {
                this._toasty.error('Пожалуйста, укажите причину отклонения эксперта.');
                return;
            }
            const reason = dlgResult?.value?.reason || "";

            request.rejectionReason = reason;
            request.onConfirmation = false;
            request.isConfirmed = false;

            this._projectService.updateRequestForManualSelection(request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: (res) => {
                    this.handleRequestUpdate(project)
                    this._toasty.success("Заявка отклонена.");
                },
                error: (error) => {
                    const errorMessage = error?.error || error?.message || 'Произошла ошибка при подтверждении';
                    this._toasty.error(errorMessage);
                }
            })

        })

    }

    onPageChanged(pageRequest: PageRequest) {
        // Оптимизация: пропускаем обновление, если страница не изменилась
        if (pageRequest.page === this._currentPage) {
            return;
        }

        // Устанавливаем флаг, чтобы предотвратить повторную загрузку из подписки на queryParams
        this._isPageChangeInProgress = true;

        // Обновляем состояние пагинации сразу и иммутабельно (важно для `app-pagination`)
        untracked(() => this.setPageState(pageRequest.page));

        // Начинаем загрузку данных немедленно, не дожидаясь обновления URL
        // Используем оптимизированную версию update() для мгновенного отображения индикатора загрузки
        this.updateOptimized();

        // Обновляем URL параллельно (не блокируем загрузку данных)
        this._router.navigate([], {
            relativeTo: this._route,
            queryParams: {page: pageRequest.page + 1}, // 1-based в URL
            queryParamsHandling: 'merge'
        }).catch(() => {
            // Если навигация не удалась, сбрасываем флаг
            this._isPageChangeInProgress = false;
        });
    }

    private handleRequestUpdate(project: ProjectDto) {
        const currentProjects = this.projects();
        // Проект больше не подходит под список — убираем его
        const updatedProjects = currentProjects.filter(p => p.id !== project.id);
        this.projects.set(updatedProjects);

        // Синхронизируем `_page` иммутабельно (важно для `app-pagination` с input() сигналами)
        if (this._page) {
            const nextTotalElements = Math.max(0, (this._page.totalElements ?? 0) - 1);
            const nextTotalPages = this._page.size > 0 ? Math.ceil(nextTotalElements / this._page.size) : 0;

            this._page = Object.assign(new Page<ProjectDto>(), this._page, {
                content: updatedProjects,
                totalElements: nextTotalElements,
                totalPages: nextTotalPages
            });

            // Если текущая страница «выпала» — переходим на последнюю доступную и перезагружаем данные
            if (nextTotalPages > 0 && this._currentPage >= nextTotalPages) {
                const lastPage = nextTotalPages - 1; // 0-based
                const pageChanged = this._currentPage !== lastPage;
                untracked(() => this.setPageState(lastPage));

                if (pageChanged) {
                    // Обновляем URL, но данные загружаем сами — не ждём queryParams effect
                    this._isPageChangeInProgress = true;
                    this._router.navigate([], {
                        relativeTo: this._route,
                        queryParams: {page: lastPage + 1},
                        queryParamsHandling: 'merge'
                    }).catch(() => {
                        this._isPageChangeInProgress = false;
                    });

                    this.updateOptimized();
                    return;
                }
            }
        }

        // Если страница не сменилась — аккуратно добираем элементы, чтобы «не пустело»
        this.loadNextPageIfNeeded(updatedProjects.length);
        return;
    }

    // Загружает следующую страницу и добавляет проекты к текущему списку
    // Вызывается реактивно после удаления проекта, чтобы список оставался заполненным
    private loadNextPageIfNeeded(currentProjectsCount: number) {
        if (!this._page || !this._page.size) {
            return;
        }

        // Если текущая страница неполная и есть следующая страница, загружаем её
        const isPageIncomplete = currentProjectsCount < this._page.size;
        const hasNextElement = this._page.size <= this._page.totalElements;

        if (isPageIncomplete && hasNextElement) {
            const token = ++this._prefetchToken;
            const anchorPage = this._currentPage;

            // Важно: не мутируем общий `_searchRequest`, чтобы не «перебить» основную загрузку страницы
            const nextRequest = {
                ...this._searchRequest,
                paging: {...this._searchRequest.paging, page: anchorPage    }
            };

            this._projectService.getAllRequestsForManualSelectionPage(nextRequest as any)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (res) => {
                        // Если пользователь уже ушёл на другую страницу/запустил другой prefetch — игнорируем результат
                        if (token !== this._prefetchToken || anchorPage !== this._currentPage) {
                            return;
                        }

                        this.projects.set(res.content);

                        // Обновляем `_page` иммутабельно, чтобы `app-pagination` корректно реагировал на input()
                        if (this._page) {
                            this._page = Object.assign(new Page<ProjectReviewsExpertsDto>(), this._page, {content: res.content});
                        }
                    },
                    error: (error) => {
                        // Не показываем ошибку пользователю, так как это фоновое обновление
                        console.warn('Не удалось загрузить следующую страницу:', error);
                    }
                });
        }
    }

}