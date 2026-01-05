import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
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
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-confirm-review-list',
    templateUrl: './confirm-review-list.component.html',
    styleUrls: ['confirm-review-list.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class ConfirmReviewListComponent extends FilterAndPages<ProjectReviewsExpertsDto> {

  ExpertReviewState = ExpertReviewState;
  projects: ProjectReviewsExpertsDto[] = [];
  expert: PersonExpertDto;
  @ViewChild('expertInfo') expertInfoModal: ModalComponent;

  constructor(
    private _toasty: GlobalToastyService,
    private _reviewService: ExpertReviewService,
    private _projectService: ProjectService,
    private _dialogService: DialogService,
    private _personPipe: PersonFullNamePipe,
    private _chartService: ChartService,
    private _route: ActivatedRoute,
    private _router: Router,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    // Подписка на изменения query-параметров (включая первую загрузку)
    this._route.queryParams.subscribe(params => {
      const pageParam = params['page'];
      const pageFromRoute = pageParam != null ? parseInt(pageParam, 10) : NaN;

      if (!isNaN(pageFromRoute) && pageFromRoute > 0) {
        // pagination.page — 1-based для пагинатора
        this._pagination.page = pageFromRoute;
        // paging.page — 0-based для бэка
        this._searchRequest.paging.page = pageFromRoute - 1;
      } else {
        // если параметр отсутствует или некорректен — считаем, что страница 1
        this._pagination.page = 1;
        this._searchRequest.paging.page = 0;
      }

      this.update();
    });
  }

  loadPage() {
    this._projectService.getConfirmReviewPage(this._searchRequest).subscribe(res => {
      this._page = res;
      this.projects = res.content;
      this.cdr?.markForCheck?.();
      this.setLoading(false);
    }, () => this.setLoading(false))

    // Используем requestAnimationFrame для асинхронной прокрутки,
    // чтобы избежать проблем с scroll-linked effects
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    });
  }

  confirmExpert(review: ExpertReviewAndExpertDto, project: ProjectReviewsExpertsDto) {
    this._dialogService.showConfirmDialog('Назначение эксперта',
      `Назначить эксперта "${this._personPipe.transform(review.expert.personName)}" на объект экспертизы "${project.title}"?`,
      'Пожалуйста, проверьте данные об эксперте, поскольку отменить действие будет невозможно.').subscribe(() => {
      this._reviewService.acceptExpert(review).subscribe(res => {
        // Обновляем статус review - он останется в списке, но с новым статусом (ON_EXPERT_CONFIRMATION)
        review.state = res.state;
        // Сразу обновляем UI - кнопки исчезнут, появится бейдж "Ожидание эксперта"
        this.cdr?.markForCheck?.();
        this._toasty.success("Подтвержден.");
        // Фоново синхронизируем с сервером для обновления других данных
        this.loadPage();
      });
    });
  }

  rejectExpert(review: ExpertReviewAndExpertDto, project: ProjectReviewsExpertsDto) {
    this._dialogService.showConfirmDialogWithFields(
      [new ConfirmDialogField<string>('reason', 'Причина отклонения')],
      'Отклонение эксперта',
      `Отклонить эксперта "${this._personPipe.transform(review.expert)}" от участия в экспертизе объекта "${project.title}"?`,
      'Пожалуйста, проверьте данные об эксперте, поскольку отменить действие будет невозможно.')
      .subscribe((dlgResult: DialogResult<any>) => {
        if (dlgResult.value.reason == null || dlgResult.value.reason == '') {
          this._toasty.error('Пожалуйста, укажите причину отклонения эксперта.');
          return;
        }
        let reason = "";
        if (dlgResult != null && dlgResult.value != null) {
          reason = dlgResult.value.reason;
        }
        this._reviewService.rejectExpert(review, reason).subscribe(res => {
          // Обновляем статус review - он останется в списке, но с новым статусом (REJECTED)
          review.state = res.state;
          // Сразу обновляем UI - кнопки исчезнут, появится бейдж "Отклонён"
          this.cdr?.markForCheck?.();
          this._toasty.success("Отклонен.");
          // Фоново синхронизируем с сервером для обновления других данных
          this.loadPage();
        });
      })
  }


  getSortOrders() {
    return [new SortOrder("registerDate", Direction.DESC)];
  }

  showExpertInfoDialog(expert: PersonExpertDto) {
    this.expertInfoModal.show();
	console.log(expert);
    this.expert = expert;
    setTimeout(() => {
     this._chartService.updateCharts();
    }, 500);
  }
  //showExpertPayInfoDialog(expert: PersonExpertDto) {
  //  this.expertId = expert.id;
  //  this.expertPayInfoModal.show();
  //}

  onPageChanged(pageRequest: PageRequest) {
    // обновляем URL с текущей страницей
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {page: pageRequest.page + 1}, // 1-based в URL
      queryParamsHandling: 'merge'
    });

    // базовая логика пагинации (FilterAndPages)
    super.onPageChanged(pageRequest);
  }
}
