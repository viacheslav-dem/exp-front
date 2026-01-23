import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  untracked,
  ViewChild
} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {ExpertReviewAndExpertDto} from "@app/dto/ExpertReviewAndExpertDto";
import {Direction, SortOrder} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {PersonFullNamePipe} from "@app/pipes/person-full-name.pipe";
import {ExpertReviewState} from "@app/pipes/review-state.pipe";
import {ExpertReviewService} from "@app/services/expert-review.service";
import {ProjectService} from "@app/services/project.service";
import {ProjectReviewsExpertsDto} from "@app/dto/ProjectReviewsExpertsDto";
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";
import {DialogResult} from "@app/components/dialogs/dialog-result";
import {PersonExpertDto} from "@app/dto/PersonExpertDto";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {ChartService} from "@app/services/chart.service";
import {ActivatedRoute, Router} from '@angular/router';
import {PageRequest} from '@app/components/common-components/page-and-filter/model/PageRequest';
import {Pagination} from "@app/components/common-components/page-and-filter/model/Pagination";
import {Page} from "@app/components/common-components/page-and-filter/model/Page";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-confirm-review-list',
    templateUrl: './confirm-review-list.component.html',
    styleUrls: ['confirm-review-list.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class ConfirmReviewListComponent extends FilterAndPages<ProjectReviewsExpertsDto> implements OnInit, OnDestroy {

  ExpertReviewState = ExpertReviewState;
  
  // Signals для реактивного состояния
  readonly projects = signal<ProjectReviewsExpertsDto[]>([]);
  readonly expert = signal<PersonExpertDto | null>(null);
  
  // Computed signals для производных значений
  readonly hasProjects = computed(() => this.projects().length > 0);
  readonly projectsCount = computed(() => this.projects().length);
  
  @ViewChild('expertInfo') expertInfoModal!: ModalComponent;
  
  // Флаг для предотвращения двойной загрузки при изменении страницы
  private _isPageChangeInProgress = false;
  
  // Текущая страница для предотвращения лишних обновлений
  private _currentPage = 0;
  
  // Флаг для отслеживания первой загрузки
  private _isInitialLoad = true;

  // Защита от гонок: игнорируем устаревшие ответы
  private _loadToken = 0;
  private _prefetchToken = 0;
  
  // Inject DestroyRef для автоматической отписки
  private readonly destroyRef = inject(DestroyRef);
  
  // Inject Injector для afterNextRender
  private readonly injector = inject(Injector);
  
  // Signal для queryParams (инициализируется в конструкторе)
  private readonly queryParamsSignal: Signal<Record<string, any>>;

  constructor(
    private _toasty: GlobalToastyService,
    private _reviewService: ExpertReviewService,
    private _projectService: ProjectService,
    private _dialogService: DialogService,
    private _personPipe: PersonFullNamePipe,
    private _chartService: ChartService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    super();

    // Этот компонент не использует кэш фильтров из `FilterAndPages`.
    // Важно: иначе при наличии кэшей других страниц базовый guard может навсегда блокировать загрузку.
    this._initialLoadDone = true;
    
    // Подписка на изменения queryParams через toSignal для реактивности
    // Создаем в конструкторе после super(), так как toSignal требует injection context
    this.queryParamsSignal = toSignal(
      this._route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)),
      { initialValue: this._route.snapshot.queryParams }
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
    // Инициализация уже выполнена в конструкторе через effect
  }
  
  ngOnDestroy() {
    // DestroyRef автоматически обработает отписки
    // Но можно добавить дополнительную логику очистки при необходимости
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

  loadPage() {
    const token = ++this._loadToken;
    const requestSnapshot = this._searchRequest;

    this._projectService.getConfirmReviewPage(requestSnapshot)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          // Игнорируем устаревший ответ (например, при быстром клике по страницам)
          if (token !== this._loadToken) {
            return;
          }
          this._page = res;
          // Обновляем signal вместо прямого присваивания
          this.projects.set(res.content);
          // markForCheck больше не нужен - signals автоматически триггерят change detection
          this.setLoading(false);
          
          // Используем afterNextRender для прокрутки после обновления DOM
          afterNextRender(() => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
          }, { injector: this.injector });
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
      });
  }

  // Загружает следующую страницу и добавляет проекты к текущему списку
  // Вызывается реактивно после удаления проекта, чтобы список оставался заполненным
  private loadNextPageIfNeeded(currentProjectsCount: number) {
    if (!this._page || !this._page.size) {
      return;
    }

    // Если текущая страница неполная и есть следующая страница, загружаем её
    const isPageIncomplete = currentProjectsCount < this._page.size;
    const hasNextPage = this._currentPage + 1 < this._page.totalPages;

    if (isPageIncomplete && hasNextPage) {
      const token = ++this._prefetchToken;
      const anchorPage = this._currentPage;
      const nextPage = this._currentPage + 1;
      
      // Вычисляем, сколько проектов нужно добавить для заполнения текущей страницы
      const projectsNeeded = this._page.size - currentProjectsCount;
      
      // Важно: не мутируем общий `_searchRequest`, чтобы не «перебить» основную загрузку страницы
      const nextRequest = {
        ...this._searchRequest,
        paging: { ...this._searchRequest.paging, page: nextPage }
      };

      this._projectService.getConfirmReviewPage(nextRequest as any)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            // Если пользователь уже ушёл на другую страницу/запустил другой prefetch — игнорируем результат
            if (token !== this._prefetchToken || anchorPage !== this._currentPage) {
              return;
            }
            
            // Берем только необходимое количество проектов для заполнения текущей страницы
            const projectsToAdd = res.content.slice(0, projectsNeeded);
            
            // Добавляем новые проекты к текущему списку
            const current = this.projects();
            const existingIds = new Set(current.map(p => p.id));
            const dedupedToAdd = projectsToAdd.filter(p => !existingIds.has(p.id));
            if (dedupedToAdd.length === 0) {
              return;
            }

            const newProjects = [...current, ...dedupedToAdd];
            this.projects.set(newProjects);

            // Обновляем `_page` иммутабельно, чтобы `app-pagination` корректно реагировал на input()
            if (this._page) {
              this._page = Object.assign(new Page<ProjectReviewsExpertsDto>(), this._page, { content: newProjects });
            }
          },
          error: (error) => {
            // Не показываем ошибку пользователю, так как это фоновое обновление
            console.warn('Не удалось загрузить следующую страницу:', error);
          }
        });
    }
  }

  confirmExpert(review: ExpertReviewAndExpertDto, project: ProjectReviewsExpertsDto) {
    this._dialogService.showConfirmDialog('Назначение эксперта',
      `Назначить эксперта "${this._personPipe.transform(review.expert.personName)}" на объект экспертизы "${project.title}"?`,
      'Пожалуйста, проверьте данные об эксперте, поскольку отменить действие будет невозможно.')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._reviewService.acceptExpert(review)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res) => {
              // Обрабатываем обновление проекта через общий метод
              // Передаем исходный review и обновленные данные для immutable обновления
              this.handleProjectUpdate(project, review, res);
              this._toasty.success("Подтвержден.");
            },
            error: (error) => {
              const errorMessage = error?.error || error?.message || 'Произошла ошибка при подтверждении';
              this._toasty.error(errorMessage);
            }
          });
      });
  }

  rejectExpert(review: ExpertReviewAndExpertDto, project: ProjectReviewsExpertsDto) {
    this._dialogService.showConfirmDialogWithFields(
      [new ConfirmDialogField<string>('reason', 'Причина отклонения')],
      'Отклонение эксперта',
      `Отклонить эксперта "${this._personPipe.transform(review.expert)}" от участия в экспертизе объекта "${project.title}"?`,
      'Пожалуйста, проверьте данные об эксперте, поскольку отменить действие будет невозможно.')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dlgResult: DialogResult<any>) => {
        if (dlgResult.value.reason == null || dlgResult.value.reason == '') {
          this._toasty.error('Пожалуйста, укажите причину отклонения эксперта.');
          return;
        }
        const reason = dlgResult?.value?.reason || "";
        this._reviewService.rejectExpert(review, reason)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res) => {
              // Обрабатываем обновление проекта через общий метод
              // Передаем исходный review и обновленные данные для immutable обновления
              this.handleProjectUpdate(project, review, res);
              this._toasty.success("Отклонен.");
            },
            error: (error) => {
              const errorMessage = error?.error || error?.message || 'Произошла ошибка при отклонении';
              this._toasty.error(errorMessage);
            }
          });
      });
  }

  // Общий метод для обработки обновления проекта после подтверждения/отклонения эксперта
  // Оптимизирован для избежания лишних обновлений signals
  private handleProjectUpdate(project: ProjectReviewsExpertsDto, originalReview: ExpertReviewAndExpertDto, updatedReviewData: any) {
    // Обновляем статус review в исходном объекте для совместимости
    originalReview.state = updatedReviewData.state;
    if (updatedReviewData.rejectionReason !== undefined) {
      originalReview.rejectionReason = updatedReviewData.rejectionReason;
    }
    
    // Проверяем, остались ли в проекте эксперты со статусом ON_GKNT_CONFIRMATION
    // Используем обновленные данные для проверки
    const updatedReviewState = updatedReviewData.state;
    const hasReviewsOnConfirmation = project.expertReviews.some(r => 
      r.id === originalReview.id ? updatedReviewState === ExpertReviewState.ON_GKNT_CONFIRMATION : r.state === ExpertReviewState.ON_GKNT_CONFIRMATION
    );
    
    const currentProjects = this.projects();
    const projectIndex = currentProjects.findIndex(p => p.id === project.id);
    if (projectIndex === -1) {
      return;
    }

    const currentProject = currentProjects[projectIndex];

    if (!hasReviewsOnConfirmation) {
      // Проект больше не подходит под список — убираем его
      const updatedProjects = currentProjects.filter(p => p.id !== project.id);
      this.projects.set(updatedProjects);

      // Синхронизируем `_page` иммутабельно (важно для `app-pagination` с input() сигналами)
      if (this._page) {
        const nextTotalElements = Math.max(0, (this._page.totalElements ?? 0) - 1);
        const nextTotalPages = this._page.size > 0 ? Math.ceil(nextTotalElements / this._page.size) : 0;

        this._page = Object.assign(new Page<ProjectReviewsExpertsDto>(), this._page, {
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

    // Проект остаётся — обновляем review иммутабельно
    const updatedReviews = currentProject.expertReviews.map(review => {
      if (review.id === originalReview.id) {
        return {
          ...review,
          state: updatedReviewData.state,
          rejectionReason: updatedReviewData.rejectionReason !== undefined ? updatedReviewData.rejectionReason : review.rejectionReason
        };
      }
      return review;
    });

    const updatedProjects = [...currentProjects];
    updatedProjects[projectIndex] = {
      ...currentProject,
      expertReviews: updatedReviews
    };

    this.projects.set(updatedProjects);
    if (this._page) {
      this._page = Object.assign(new Page<ProjectReviewsExpertsDto>(), this._page, { content: updatedProjects });
    }
  }


  getSortOrders() {
    return [new SortOrder("registerDate", Direction.DESC)];
  }

  trackByProject(index: number, project: ProjectReviewsExpertsDto): any {
    return project.id;
  }

  trackByReview(index: number, review: ExpertReviewAndExpertDto): any {
    return review.id;
  }

  trackByGroup(index: number, group: any): any {
    return group.id;
  }

  showExpertInfoDialog(expert: PersonExpertDto) {
    this.expertInfoModal.show();
    // Обновляем signal вместо прямого присваивания
    this.expert.set(expert);
    // Используем afterNextRender вместо setTimeout для обновления графиков
    afterNextRender(() => {
      this._chartService.updateCharts();
    }, { injector: this.injector });
  }
  //showExpertPayInfoDialog(expert: PersonExpertDto) {
  //  this.expertId = expert.id;
  //  this.expertPayInfoModal.show();
  //}

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
}
