import {Component, ChangeDetectionStrategy, signal, ChangeDetectorRef, AfterViewInit, OnDestroy, ElementRef, effect, viewChild, viewChildren} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {PersonService} from "@app/services/person.service";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {Direction, sortByName, SortOrder} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {PersonExpertDto} from "@app/dto/PersonExpertDto";
import {Catalog, DataService} from "@app/services/data.service";
import {DegreeTypePipe, getAllDegreeTypes} from "@app/pipes/degree.pipe";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import {ExpertReviewState} from "@app/pipes/review-state.pipe";
import {ProjectService} from "@app/services/project.service";
import {Router} from "@angular/router";
import {PersonFullNamePipe} from "@app/pipes/person-full-name.pipe";
import dayjs from 'dayjs';
import {AcademicTitleTypePipe, getAllAcademicTitleTypes} from "@app/pipes/academic-title.pipe";
import {Role} from "@app/pipes/role.pipe";
import {AuthService} from "@app/services/auth.service";
import {ExpertReviewService} from "@app/services/expert-review.service";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";

@Component({
    selector: 'app-expert-list',
    templateUrl: './expert-list.component.html',
    styleUrls: ['./expert-list.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpertListComponent extends FilterAndPages<PersonExpertDto> implements AfterViewInit, OnDestroy {

  experts = signal<PersonExpertDto[]>([]);
  sortOrder: SortOrder = new SortOrder('person', Direction.ASC);
  Role = Role;
  expertId = signal<number | undefined>(undefined);
  showFilter = signal<boolean>(false);
  readonly expertPayInfoModal = viewChild<ModalComponent>('expertPayInfo');
  readonly chartContainers = viewChildren<ElementRef>('chartContainer');

  // Map для отслеживания загруженных графиков по ID эксперта
  chartsLoaded = signal<Set<number>>(new Set());
  private observer?: IntersectionObserver;
  private subscriptions: Subscription[] = [];

  private readonly chartContainersEffect = effect(() => {
    this.chartContainers();
    this.observeChartContainers();
  });

  constructor(
    private toasty: GlobalToastyService,
    private _personService: PersonService,
    private _dataService: DataService,
    private userEditService: DialogService,
    private _degreeTypePipe: DegreeTypePipe,
    private _academicTitleTypePipe: AcademicTitleTypePipe,
    private _projectService: ProjectService,
    private _router: Router,
    private _personPipe: PersonFullNamePipe,
    private _authService: AuthService,
    private _expertReviewService: ExpertReviewService,
    private cdr: ChangeDetectorRef,
  ) {
    super(5);
  }

  ngOnInit() {
    this._searchFields = [
      SearchField.startsWith('personName.lastName').setPlaceholder('Поиск по фамилии...'),
      SearchField.multiSelect('personInfo.fullDegrees.degreeType', getAllDegreeTypes(), value => this._degreeTypePipe.transform(value))
        .setSelectText("учёная степень"),
      SearchField.multiSelect('personInfo.fullDegrees.scienceArea', Catalog.SCIENCE_AREA)
        .setSelectText('Отрасль науки').setSearchFilterEnabled(true),
      SearchField.multiSelect('personInfo.academicTitleType', getAllAcademicTitleTypes(), value => this._academicTitleTypePipe.transform(value))
        .setSelectText("учёное звание"),
      SearchField.multiSelect('personInfo.specialities', Catalog.SPECIALITY).setSelectText('Специальность').setSearchFilterEnabled(true),
      SearchField.multiSelect('personInfo.specializations', Catalog.SPECIALIZATION).setSelectText('Специализация').setSearchFilterEnabled(true),
      SearchField.multiSelect('org', []).setSelectText('Организация').setSearchFilterEnabled(true),
      SearchField.contains('org.unp').setPlaceholder('Поиск по УНП...'),
      SearchField.contains('org.orgAddress').setPlaceholder('Поиск по адресу...'),
      SearchField.contains('post').setPlaceholder('Поиск по должности...'),
      SearchField.multiSelect('areas', Catalog.AREA_OF_COMPETENCE)
        .setSelectText('область компетенции')
        .setSearchFilterEnabled(true)
        // Чуть шире на больших экранах, чтобы текст не “зажимался”
        .setFieldClass('col-xl-3'),
    ];
    // Load orgs after fields are initialized
    this.subscriptions.push(
      this._dataService.getOrgs().subscribe({
        next: (orgs) => {
          this.getSearchField('org').setItems(orgs);
          this.cdr.markForCheck();
        }
      })
    );
    
    // Включаем кэш фильтров и загружаем начальные данные
    this.enableFilterCache("experts");
    
    // Initial load - update будет вызван автоматически в enableFilterCache если есть сохраненное состояние
    // Если нет сохраненного состояния, вызываем update после небольшой задержки
    timer(150).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      // Проверяем, был ли уже вызван update через enableFilterCache
      // Используем флаг _initialLoadDone вместо _loading, так как setLoading использует setTimeout
      if (!(this as any)._initialLoadDone) {
        (this as any)._initialLoadDone = true;
        this.update();
      }
    });
  }

  loadPage() {
    // Очищаем список экспертов при начале новой загрузки
    this.experts.set([]);
    this.subscriptions.push(
      this._personService.searchExperts(this._searchRequest).subscribe({
        next: (res) => {
          this._page = res;
          this.experts.set(res.content);
          this.setLoading(false);
          this.cdr.markForCheck();
          // После обновления списка экспертов, обновляем observer
          // Используем requestAnimationFrame для гарантии, что DOM обновлен
          requestAnimationFrame(() => {
            this.observeChartContainers();
          });
        },
        error: () => {
          this.setLoading(false);
          this.cdr.markForCheck();
        }
      })
    );
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
    // effect может сработать до ngAfterViewInit (observer ещё undefined). Гарантируем
    // первичную подписку на контейнеры после инициализации observer.
    timer(0).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.observeChartContainers());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const expertId = parseInt(entry.target.getAttribute('data-expert-id') || '0', 10);
          if (expertId && !this.chartsLoaded().has(expertId)) {
            const loaded = new Set(this.chartsLoaded());
            loaded.add(expertId);
            this.chartsLoaded.set(loaded);
            this.cdr.markForCheck();
            // Отключаем наблюдение для этого элемента после загрузки
            this.observer?.unobserve(entry.target);
          }
        }
      });
    }, {
      rootMargin: '100px' // Начинаем загрузку за 100px до появления в viewport
    });
  }

  private observeChartContainers() {
    if (!this.observer) {
      return;
    }
    
    // Очищаем предыдущие наблюдения
    this.observer.disconnect();
    
    // Добавляем наблюдение за новыми контейнерами
    this.chartContainers().forEach(container => {
      if (container.nativeElement) {
        this.observer?.observe(container.nativeElement);
      }
    });
  }

  isChartsLoaded(expertId: number): boolean {
    return this.chartsLoaded().has(expertId);
  }

  getSortOrders() {
    return sortByName('personName.', Direction.ASC);
  }

  trackByExpert(index: number, expert: PersonExpertDto): any {
    return expert?.id || index;
  }

  showProjectsOnExpertExamination(expert: PersonExpertDto) {
    this._projectService.filterName = 'Объекты экспертизы, над которыми работает эксперт ' + this._personPipe.transform(expert.personName);
    this._projectService.filter = FilterBuilder.and('', [
      FilterBuilder.equals('expertReviews.expert', expert.id),
      FilterBuilder.equals('expertReviews.state', ExpertReviewState.ON_EXAMINATION),
    ]);
    this._router.navigateByUrl('projects-filtered').then();
  }

  showProjectsOnExpertConfirmation(expert: PersonExpertDto) {
    this._projectService.filterName = 'Объекты экспертизы, на которые ожидает подтверждения эксперт ' + this._personPipe.transform(expert.personName);
    this._projectService.filter = FilterBuilder.and('', [
      FilterBuilder.equals('expertReviews.expert', expert.id),
      FilterBuilder.in('expertReviews.state', [ExpertReviewState.ON_EXPERT_CONFIRMATION, ExpertReviewState.ON_GKNT_CONFIRMATION]),
    ]);
    this._router.navigateByUrl('projects-filtered').then();
  }

  showProjectsExpertReviewFinished(expert: PersonExpertDto) {
    this._projectService.filterName = 'Объекты экспертизы, над которыми работал эксперт ' + this._personPipe.transform(expert.personName);
    this._projectService.filter = FilterBuilder.and('', [
      FilterBuilder.equals('expertReviews.expert', expert.id),
      FilterBuilder.in('expertReviews.state', [ExpertReviewState.PROJECT_ACCEPTED, ExpertReviewState.PROJECT_REJECTED]),
    ]);
    this._router.navigateByUrl('projects-filtered').then();
  }

  showProjectsExpertReviewsTermsViolation(expert: PersonExpertDto) {
    this._projectService.filterName = 'Объекты экспертизы, по которым эксперт ' + this._personPipe.transform(expert.personName) + ' нарушил сроки экспертизы';
    this._projectService.filter = FilterBuilder.and('', [
      FilterBuilder.equals('expertReviews.expert', expert.id),
      FilterBuilder.equals('expertReviews.state', ExpertReviewState.ON_EXAMINATION),
      FilterBuilder.dateRange('expertReviews.stateEndDate', null, dayjs().subtract(1, 'day').valueOf())
    ]);
    this._router.navigateByUrl('projects-filtered').then();
  }

  getCurrentRole(): Role {
    return this._authService.getCurrRole();
  }

  showExpertPayInfoDialog(expert: PersonExpertDto) {
    this.expertId.set(expert.id);
    this.expertPayInfoModal()?.show();
  }
}
