import {Component, EventEmitter, Input, OnInit, Output, Type, ViewChild, input} from "@angular/core";
import {ExpertReviewState, ExpertReviewStateBadge} from "@app/pipes/review-state.pipe";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {
    ExpertReviewFormResolver
} from "@app/components/document-form/expert-review-form-container/expert-review-form-resolver.service";
import {ExpertReviewDto} from "@app/dto/ExpertReviewDto";
import {ExpertReviewService} from "@app/services/expert-review.service";
import {ExpertTransitionHistoryDto} from "@app/dto/ExpertTransitionHistoryDto";
import {TransitionHistoryService} from "@app/services/transition-history.service";
import {Role} from "@app/pipes/role.pipe";
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {AccountingService} from "@app/services/accounting.service";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";
import {DialogResult} from "@app/components/dialogs/dialog-result";
import {PersonFullNamePipe} from "@app/pipes/person-full-name.pipe";
import {anyMatch} from "@app/support/utils";
import {SERVER_URL} from "@app/config";
import {ProjectState} from "@app/pipes/project-state.pipe";
import {DocType} from "@app/components/common-components/file-uploader/doc-type";
import {
    ExpertReviewFormContainerComponent
} from "@app/components/document-form/expert-review-form-container/expert-review-form-container.component";
import {DataService} from "@app/services/data.service";
//import { takeWhile } from 'rxjs/operators';
import {PeriodDto} from "@app/dto/PeriodDto";
import dayjs from 'dayjs';
import {AccountingPlainDto} from "@app/dto/AccountingPlainDto";
import {TemplateType} from "@app/components/document-form/form-model/TemplateType";

@Component({
    selector: 'app-expert-review',
    templateUrl: './expert-review.component.html',
    styleUrls: ['expert-review.component.scss'],
    standalone: false
})
export class ExpertReviewComponent implements OnInit {

    Role = Role;
    ExpertReviewState = ExpertReviewState;
    SERVER_URL = SERVER_URL;
    DocType = DocType;
    period = new PeriodDto(dayjs().valueOf(), dayjs().valueOf());

    expertReview: ExpertReviewDto = new ExpertReviewDto();
    transitionHistory: ExpertTransitionHistoryDto;

    readonly role = input<string>(undefined);
    readonly project = input<any>({});

    formRenderer: Type<ExpertReviewForm<any>>;

    @ViewChild('reviewFormModal', { static: false }) reviewFormModal: ModalComponent;
    @ViewChild('transitionHistoryModal', { static: false }) transitionHistoryModal: ModalComponent;
    @ViewChild(ExpertReviewFormContainerComponent, { static: false }) expertReviewForm: ExpertReviewFormContainerComponent<any>;

    @Output() onChanged: EventEmitter<any> = new EventEmitter();

    constructor(private _toasty: GlobalToastyService,
                private _formResolver: ExpertReviewFormResolver,
                public _reviewService: ExpertReviewService,
                private _transitionHistoryService: TransitionHistoryService,
                private _accountingService: AccountingService,
                private _dialogService: DialogService,
                private _personPipe: PersonFullNamePipe,
                private toastService: GlobalToastyService,
                private _dataService: DataService) {
    }

    ngOnInit(): void {
    }

    @Input() set review(review: ExpertReviewDto) {
        if (!review) return;
        this._reviewService.prepareReview(review);
        review.badge = ExpertReviewStateBadge[review.state];
        review.expectedBadge = ExpertReviewStateBadge[review.expectedState];
        this.expertReview = review;
    }

    showTransitionHistoryModal() {
        this.transitionHistoryModal.show();
        this._transitionHistoryService.getExpertHistory(this.expertReview)
            .subscribe(res => this.transitionHistory = res);
    }

    changed() {
        this.onChanged.emit(this.expertReview);
    }

    showReviewFormModal() {
        this.formRenderer = this._formResolver.getFormRenderer(this.project().code.expertReviewType);
        if (!this.formRenderer) {
            this._toasty.warn("Не найдено подходящей формы экспертного заключения. Будет сегенерирован документ по умолчанию.");
            this.generateReviewDocument({});
        } else {
            this.reviewFormModal.show();
            this.expertReviewForm.startAutoSave();
        }
    }

    canEditReviewDocument() {
        return anyMatch(this.role(), Role.EXPERT, Role.BELISA_EDIT) &&
            this.expertReview.state == ExpertReviewState.ON_EXAMINATION;
    }

    canEditReviewScan() {
        return this.role() == Role.BELISA_EDIT &&
            this.expertReview.state == ExpertReviewState.ON_EXAMINATION;
    }

    reviewScanLoaded(doc) {
        this.expertReview.reviewScan = doc;
        this.changed();
    }

    canReadReviewScan() {
        return this.canEditReviewScan() ||
            this.expertReview.reviewScan && this.expertReview.state != this.ExpertReviewState.ON_EXAMINATION;
    }

    refreshContract() {
        // this._dialogService.showConfirmDialogWithFields(
        //     [new ConfirmDialogField<Date>('startDate', 'Дата начала работ', 'date'),
        //         new ConfirmDialogField<Date>('endDate', 'Дата завершения работ', 'date')],
        //     'Пересоздание документа',
        //     `Пересоздать договор в соответствии с изменившимися данными в системе?`,
        //     'Дата договора при этом останется неизменной'
        this._dialogService.showConfirmDialog(
            'Пересоздание документа',
                 `Пересоздать договор в соответствии с изменившимися данными в системе?`,
                 'Дата договора при этом останется неизменной'
        ).subscribe((dlgResult: DialogResult<any>) => {
         //   let period = new PeriodDto(dlgResult.value.startDate, dlgResult.value.endDate)
            this._accountingService.refreshContract(this.expertReview.accounting
            //    , period
            ).subscribe(res => {
                this.expertReview.accounting = <AccountingPlainDto>res;
                this._toasty.success("Документ успешно обновлён.");
            });
        });
    }

    refreshAct() {
        this._dialogService.showConfirmDialog(
            'Пересоздание документа',
            `Пересоздать акт в соответствии с изменившимися данными в системе?`,
            'Дата акта и сумма выплат при этом останутся неизменными'
        ).subscribe(() => {
            this._accountingService.refreshAct(this.expertReview.accounting).subscribe(res => {
                this.expertReview.accounting = <AccountingPlainDto>res;
                this._toasty.success("Документ успешно обновлён.");
            });
        });
    }

    generateReviewDocument(reviewForm) {
        console.log(reviewForm);
        this._reviewService.generateReviewDocument(this.expertReview, reviewForm).subscribe(res => {
            this.closeForm();
            this.review = res;
            this.changed();
        });
    }

    deleteReviewDocument(doc) {
        this._reviewService.deleteReviewDocument(this.expertReview, doc, () => {
            this.expertReview.documents = this.expertReview.documents.filter(d => d.id != doc.id);
            this.changed();
        });
    }

    deleteReviewScan() {
        this._reviewService.deleteReviewScan(this.expertReview).subscribe(() => {
            this.expertReview.reviewScan = null;
            this.changed();
        });
    }

    acceptExpertByBelisa() {
        this._dialogService.showConfirmDialog(
            'Подтверждение согласия эксперта на проект',
            `Эксперт ${this._personPipe.transform(this.expertReview.expert)} согласился провести экспертизу объекта "${this.project().title}"?`,
            'Он сможет приступить к работе после согласования зам. Председателя ГКНТ ' +
            'и обязан будет завершить экспертизу в течение установленного нормативными актами срока.'
        ).subscribe(() => {
            this._reviewService.acceptProject(this.expertReview).subscribe(res => {
                this.review = res;
                this._toasty.success("Вы подтвердили согласие эксперта.");
                this.changed();
            });
        });
    }

    canReassignExpert() {
        return this.expertReview.state == ExpertReviewState.REJECTED &&
            anyMatch(this.role(), Role.BELISA_EDIT, Role.SECTION_CHAIRMAN, Role.BUREAU_CHAIRMAN) &&
            this.project().state == ProjectState.ON_EXPERT_EXAMINATION;
    }

    reassignExpert() {
        this._dialogService.showConfirmDialog(
            'Переназначение эксперта',
            `Назначить повторно эксперта "${this._personPipe.transform(this.expertReview.expert)}" на объект экспертизы "${this.project().title}"?`,
            ''
        ).subscribe(() => {
            this._reviewService.reassignExpert(this.expertReview).subscribe(res => {
                this.review = res;
                this._toasty.success("Эксперт переназначен.");
                this.changed();
            });
        });
    }

    rejectExpertByBelisa() {
        this._dialogService.showConfirmDialogWithFields(
            [new ConfirmDialogField<string>('reason', 'Причина отказа')],
            'Отказ эксперта от проведения экспертизы',
            `Эксперт ${this._personPipe.transform(this.expertReview.expert)} отказался от проведения экспертизы объекта "${this.project().title}"?`)
            .subscribe((dlgResult: DialogResult<any>) => {
                let reason = "";
                if (dlgResult != null && dlgResult.value != null)
                    reason = dlgResult.value.reason;
                this._reviewService.rejectProject(this.expertReview, reason).subscribe(res => {
                    this.review = res;
                    this._toasty.success("Вы подтвердили отказ эксперта.");
                    this.changed();
                });
            });
    }

    canBelisaFinishExamination() {
        return this.role() == Role.BELISA_EDIT && this.expertReview.state == ExpertReviewState.ON_EXAMINATION
            && this.expertReview.documents.length > 0 && this.expertReview.reviewScan;
    }
    canRollbackExpertReview() {
        return this.role() == Role.BELISA_EDIT;
    }

    finishExpertExaminationByBelisa() {
        this._dialogService.showConfirmDialog(
            'Завершение экспертизы',
            `Завершить экспертизу объекта "${this.project().title} экспертом ${this._personPipe.transform(this.expertReview.expert)}"?`
        ).subscribe(() => {
            this._reviewService.finishReview(this.expertReview).subscribe(res => {
                this.review = res;
                this._toasty.success("Вы завершили экспертизу объекта.");
                this.changed();
            })
        });
    }

    rollbackExpertReview() {
        this._dialogService.showConfirmDialog(
            'Доработка экспертного заключения',
            `Отправить экспертное заключение на доработку экспертом ${this._personPipe.transform(this.expertReview.expert)}"?`
        ).subscribe(() => {
            this._reviewService.rollbackReview(this.expertReview).subscribe(res => {
                this.review = res;
                this._toasty.success("Отправили заключение на доработку.");
                this.changed();
            })
        });
    }

    closeForm() {
        this.expertReviewForm.close();
    }

    closeModal() {
        this.reviewFormModal.hide();
    }
}
