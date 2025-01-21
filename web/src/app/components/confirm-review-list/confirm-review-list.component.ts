import {Component, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-confirm-review-list',
  templateUrl: './confirm-review-list.component.html',
  styles: [`
    .chart {
      margin: 0;
    }
  `]
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
  ) {
    super();
  }

  loadPage() {
    this._projectService.getConfirmReviewPage(this._searchRequest).subscribe(res => {
      this._page = res;
      this.projects = res.content;
      this.setLoading(false);
    }, () => this.setLoading(false))

    window.scroll({
      top: 0,
      left: 0,
    });
  }

  confirmExpert(review: ExpertReviewAndExpertDto, project: ProjectReviewsExpertsDto) {
    this._dialogService.showConfirmDialog('Назначение эксперта',
      `Назначить эксперта "${this._personPipe.transform(review.expert.personName)}" на объект экспертизы "${project.title}"?`,
      'Пожалуйста, проверьте данные об эксперте, поскольку отменить действие будет невозможно.').subscribe(() => {
      this._reviewService.acceptExpert(review).subscribe(res => {
        review.state = res.state;
        this._toasty.success("Потвержден.");
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
          review.state = res.state;
          this._toasty.success("Отклонен.");
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
   // this.expertId = expert.id;
    //this.expertPayInfoModal.show();
  //}
}
