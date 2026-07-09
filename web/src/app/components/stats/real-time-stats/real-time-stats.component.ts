import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {RealTimeStatsDto} from "@app/dto/RealTimeStatsDto";
import {StatsService} from "@app/services/stats.service";
import {ProjectService} from "@app/services/project.service";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import {ProjectState} from "@app/pipes/project-state.pipe";
import {Router} from "@angular/router";
import {AccountingService} from "@app/services/accounting.service";
import {AccountingState} from "@app/pipes/accounting.pipe";
import {ExpertReviewState} from "@app/pipes/review-state.pipe";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-real-time-stats',
    templateUrl: './real-time-stats.component.html',
    styleUrls: ['./real-time-stats.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.stats) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Eager
})
export class RealTimeStatsComponent {

  realTimeStats: RealTimeStatsDto;

  constructor(private _statsService: StatsService,
              private _projectService: ProjectService,
              private _accountingService: AccountingService,
              private _router: Router,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.update();
  }

  update() {
    this._statsService.getRealTimeStats().subscribe(res => {
      this.realTimeStats = res;
      this.cdr?.markForCheck?.();
    });
  }

  showGkntProjects() {
    // this._projectService.filterName = 'Объекты экспертизы на рассмотрении в ГКНТ';
    this._projectService.filterName = 'Объекты экспертизы на рассмотрении в БелИСА';
    this._projectService.filter = FilterBuilder.in('state', [
      ProjectState.NEW, ProjectState.ON_CHECKING, ProjectState.ON_DEPARTMENT_SIGNING, ProjectState.ON_SIGNING,
      ProjectState.ON_DEPARTMENT_FINAL_SIGNING, ProjectState.ON_FINAL_SIGNING
    ]);
    this._router.navigateByUrl('projects-filtered').then();
  }

  showCouncilProjects() {
    this._projectService.filterName = 'Объекты на экспертизе в ГЭСах';
    this._projectService.filter = FilterBuilder.in('state', [
      ProjectState.ON_EXPERT_EXAMINATION, ProjectState.ON_EXAMINATION
    ]);
    this._router.navigateByUrl('projects-filtered').then();
  }

  showProjectsOnExpertExamination() {
    this._projectService.filterName = 'Объекты экспертизы, по которым готовятся экспертные заключения';
    this._projectService.filter = FilterBuilder.equals('expertReviews.state', ExpertReviewState.ON_EXAMINATION);
    this._router.navigateByUrl('projects-filtered').then();
  }

  showProjectsOnExpertConfirmation() {
    this._projectService.filterName = 'Объекты экспертизы, по которым ожидают назначения эксперты';
    this._projectService.filter = FilterBuilder.in('expertReviews.state', [
      ExpertReviewState.ON_EXPERT_CONFIRMATION, ExpertReviewState.ON_GKNT_CONFIRMATION
    ]);
    this._router.navigateByUrl('projects-filtered').then();
  }

  showPaymentWaiting() {
    this._accountingService.filterName = 'эксперты и члены ГЭС, ожидающие оплаты';
    this._accountingService.filter = FilterBuilder.equals('state', AccountingState.PAYMENT_WAITING);
    this._router.navigateByUrl('accounting-filtered').then();
  }

  showProjectTermsViolation($event) {
    this._projectService.filterName = 'Объекты экспертизы, по которым ' + $event.filterName;
    this._projectService.filter = $event.filter;
    this._router.navigateByUrl('projects-filtered').then();
  }

  showExpertReviewsTermsViolation($event) {
    this._projectService.filterName = 'Объекты экспертизы, ожидающие экспертные заключения, по которым ' + $event.filterName;
    this._projectService.filter = FilterBuilder.and('', [
      $event.filter,
      FilterBuilder.equals('expertReviews.state', ExpertReviewState.ON_EXAMINATION)
    ]);
    this._router.navigateByUrl('projects-filtered').then();
  }

  showPaymentTermsViolation($event) {
    this._accountingService.filterName = 'выплаты, по которым ' + $event.filterName;
    this._accountingService.filter = $event.filter;
    this._router.navigateByUrl('accounting-filtered').then();
  }
}
