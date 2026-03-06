import {Component, OnInit, Type, ChangeDetectionStrategy, DestroyRef, effect, input, signal, output, viewChild} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
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
//import { takeWhile } from 'rxjs/operators';
import {AccountingPlainDto} from "@app/dto/AccountingPlainDto";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-expert-review',
    templateUrl: './expert-review.component.html',
    styleUrls: ['expert-review.component.scss'],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class ExpertReviewComponent implements OnInit {

    Role = Role;
    ExpertReviewState = ExpertReviewState;
    SERVER_URL = SERVER_URL;
    DocType = DocType;

    readonly expertReview = signal<ExpertReviewDto>(new ExpertReviewDto());
    readonly transitionHistory = signal<ExpertTransitionHistoryDto>(undefined);
    readonly formRenderer = signal<Type<ExpertReviewForm<any>>>(null);
    readonly isCreatingReviewDocument = signal(false);
    readonly refreshContractLoading = signal(false);
    readonly refreshActLoading = signal(false);

    readonly role = input<string>(undefined);
    // Важно: дефолт не должен быть {}, иначе `project()` truthy и шаблон/логика могут пойти по ветке,
    // где ожидается полноценно загруженный ProjectDto (с `code.expertReviewType`).
    readonly project = input<any>(undefined);

    // Signal queries (zoneless-friendly): читаем через вызов `()`.
    readonly reviewFormModal = viewChild<ModalComponent>('reviewFormModal');
    readonly transitionHistoryModal = viewChild<ModalComponent>('transitionHistoryModal');
    readonly expertReviewForm = viewChild<ExpertReviewFormContainerComponent<any>>(ExpertReviewFormContainerComponent);

    readonly onChanged = output<any>();

    readonly review = input<ExpertReviewDto>(undefined);

    constructor(private _toasty: GlobalToastyService,
                private _formResolver: ExpertReviewFormResolver,
                public _reviewService: ExpertReviewService,
                private _transitionHistoryService: TransitionHistoryService,
                private _accountingService: AccountingService,
                private _dialogService: DialogService,
                private _personPipe: PersonFullNamePipe,
                private readonly destroyRef: DestroyRef) {
        effect(() => {
            const review = this.review();
            if (!review) return;
            const reviewCopy = { ...review };
            this._reviewService.prepareReview(reviewCopy);
            reviewCopy.badge = ExpertReviewStateBadge[reviewCopy.state];
            reviewCopy.expectedBadge = ExpertReviewStateBadge[reviewCopy.expectedState];
            this.expertReview.set(reviewCopy);
        });
    }

    ngOnInit(): void {
    }

    showTransitionHistoryModal() {
        this.transitionHistoryModal()?.show();
        this._transitionHistoryService.getExpertHistory(this.expertReview())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.transitionHistory.set(res);
                },
                error: (error) => {
                    const errorMessage = error?.error || error?.message || 'Произошла ошибка при загрузке истории переходов';
                    this._toasty.error(errorMessage);
                }
            });
    }

    changed() {
        this.onChanged.emit(this.expertReview());
    }

    showReviewFormModal() {
        if (this.isCreatingReviewDocument()) {
            return;
        }
        const expertReviewType = this.project()?.code?.expertReviewType;
        this.formRenderer.set(expertReviewType
          ? this._formResolver.getFormRenderer(expertReviewType)
          : null);
        if (!this.formRenderer()) {
            this._toasty.warn("Не найдено подходящей формы экспертного заключения. Будет сегенерирован документ по умолчанию.");
            this.generateReviewDocument({});
        } else {
            this.reviewFormModal()?.show();
            this.expertReviewForm()?.startAutoSave();
        }
    }

    canEditReviewDocument() {
        return anyMatch(this.role(), Role.EXPERT, Role.BELISA_EDIT) &&
            this.expertReview().state == ExpertReviewState.ON_EXAMINATION;
    }

    canEditReviewScan() {
        return this.role() == Role.BELISA_EDIT &&
            this.expertReview().state == ExpertReviewState.ON_EXAMINATION;
    }

    reviewScanLoaded(doc) {
        this.updateExpertReview((review) => ({
            ...review,
            reviewScan: doc
        }));
        this.changed();
    }

    canReadReviewScan() {
        return this.canEditReviewScan() ||
            this.expertReview().reviewScan && this.expertReview().state != this.ExpertReviewState.ON_EXAMINATION;
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
        ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.refreshContractLoading.set(true);
            this._accountingService.refreshContract(this.expertReview().accounting)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                next: (res) => {
                    this.updateExpertReview((review) => ({
                        ...review,
                        accounting: res as AccountingPlainDto
                    }));
                    this._toasty.success("Документ успешно обновлён.");
                    this.refreshContractLoading.set(false);
                },
                error: (error) => {
                    const errorMessage = error?.error || error?.message || 'Произошла ошибка при обновлении договора';
                    this._toasty.error(errorMessage);
                    this.refreshContractLoading.set(false);
                }
            });
        });
    }

    refreshAct() {
        this._dialogService.showConfirmDialog(
            'Пересоздание документа',
            `Пересоздать акт в соответствии с изменившимися данными в системе?`,
            'Дата акта и сумма выплат при этом останутся неизменными'
        ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.refreshActLoading.set(true);
            this._accountingService.refreshAct(this.expertReview().accounting)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                next: (res) => {
                    this.updateExpertReview((review) => ({
                        ...review,
                        accounting: res as AccountingPlainDto
                    }));
                    this._toasty.success("Документ успешно обновлён.");
                    this.refreshActLoading.set(false);
                },
                error: (error) => {
                    const errorMessage = error?.error || error?.message || 'Произошла ошибка при обновлении акта';
                    this._toasty.error(errorMessage);
                    this.refreshActLoading.set(false);
                }
            });
        });
    }

    generateReviewDocument(reviewForm) {
        if (this.isCreatingReviewDocument()) {
            return;
        }
        this.isCreatingReviewDocument.set(true);

        this._reviewService.generateReviewDocument(this.expertReview(), reviewForm)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (res) => {
                this.isCreatingReviewDocument.set(false);
                this.closeForm();
                this.applyReview(res);
                this.changed();
            },
            error: () => {
                this.isCreatingReviewDocument.set(false);
                this._toasty.error('Ошибка при создании документа');
            }
        });
    }

    deleteReviewDocument(doc) {
        this._reviewService.deleteReviewDocument(this.expertReview(), doc, () => {
            this.updateExpertReview((review) => ({
                ...review,
                documents: (review.documents || []).filter(d => d.id != doc.id)
            }));
            this.changed();
        });
    }

    deleteReviewScan() {
        this._reviewService.deleteReviewScan(this.expertReview())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.updateExpertReview((review) => ({
                    ...review,
                    reviewScan: null
                }));
                this.changed();
            },
            error: (error) => {
                const errorMessage = error?.error || error?.message || 'Произошла ошибка при удалении скана';
                this._toasty.error(errorMessage);
            }
        });
    }

    acceptExpertByBelisa() {
        this._dialogService.showConfirmDialog(
            'Подтверждение согласия эксперта на проект',
            `Эксперт ${this._personPipe.transform(this.expertReview().expert)} согласился провести экспертизу объекта "${this.project().title}"?`,
            'Он сможет приступить к работе после согласования зам. Председателя ГКНТ ' +
            'и обязан будет завершить экспертизу в течение установленного нормативными актами срока.'
        ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this._reviewService.acceptProject(this.expertReview())
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                next: (res) => {
                    this.applyReview(res);
                    this._toasty.success("Вы подтвердили согласие эксперта.");
                    this.changed();
                },
                error: (error) => {
                    // При ошибке 400 (невозможный переход) обновляем данные с сервера
                    // и показываем понятное сообщение пользователю
                    const errorMessage = error?.error || error?.message || 'Произошла ошибка при подтверждении';
                    if (error?.status === 400) {
                        this._toasty.error('Невозможно подтвердить согласие. Состояние экспертизы могло измениться. Обновите страницу.');
                        // Обновляем данные через changed(), чтобы родительский компонент перезагрузил данные
                        this.changed();
                    } else {
                        this._toasty.error(errorMessage);
                    }
                }
            });
        });
    }

    canReassignExpert() {
        return this.expertReview().state == ExpertReviewState.REJECTED &&
            anyMatch(this.role(), Role.BELISA_EDIT, Role.SECTION_CHAIRMAN, Role.BUREAU_CHAIRMAN) &&
            this.project().state == ProjectState.ON_EXPERT_EXAMINATION;
    }

    reassignExpert() {
        this._dialogService.showConfirmDialog(
            'Переназначение эксперта',
            `Назначить повторно эксперта "${this._personPipe.transform(this.expertReview().expert)}" на объект экспертизы "${this.project().title}"?`,
            ''
        ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this._reviewService.reassignExpert(this.expertReview())
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                next: (res) => {
                    this.applyReview(res);
                    this._toasty.success("Эксперт переназначен.");
                    this.changed();
                },
                error: (error) => {
                    const errorMessage = error?.error || error?.message || 'Произошла ошибка при переназначении';
                    if (error?.status === 400) {
                        this._toasty.error('Невозможно переназначить эксперта. Состояние экспертизы могло измениться. Обновите страницу.');
                        this.changed();
                    } else {
                        this._toasty.error(errorMessage);
                    }
                }
            });
        });
    }

    rejectExpertByBelisa() {
        this._dialogService.showConfirmDialogWithFields(
            [new ConfirmDialogField<string>('reason', 'Причина отказа')],
            'Отказ эксперта от проведения экспертизы',
            `Эксперт ${this._personPipe.transform(this.expertReview().expert)} отказался от проведения экспертизы объекта "${this.project().title}"?`)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((dlgResult: DialogResult<any>) => {
                let reason = "";
                if (dlgResult != null && dlgResult.value != null)
                    reason = dlgResult.value.reason;
                this._reviewService.rejectProject(this.expertReview(), reason)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                    next: (res) => {
                        this.applyReview(res);
                        this._toasty.success("Вы подтвердили отказ эксперта.");
                        this.changed();
                    },
                    error: (error) => {
                        const errorMessage = error?.error || error?.message || 'Произошла ошибка при отклонении';
                        if (error?.status === 400) {
                            this._toasty.error('Невозможно отклонить эксперта. Состояние экспертизы могло измениться. Обновите страницу.');
                            this.changed();
                        } else {
                            this._toasty.error(errorMessage);
                        }
                    }
                });
            });
    }

    canBelisaFinishExamination() {
        return this.role() == Role.BELISA_EDIT && this.expertReview().state == ExpertReviewState.ON_EXAMINATION
            && (this.expertReview().documents?.length ?? 0) > 0 && this.expertReview().reviewScan;
    }
    canRollbackExpertReview() {
        return this.role() == Role.BELISA_EDIT;
    }

    finishExpertExaminationByBelisa() {
        this._dialogService.showConfirmDialog(
            'Завершение экспертизы',
            `Завершить экспертизу объекта "${this.project().title} экспертом ${this._personPipe.transform(this.expertReview().expert)}"?`
        ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this._reviewService.finishReview(this.expertReview())
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                next: (res) => {
                    this.applyReview(res);
                    this._toasty.success("Вы завершили экспертизу объекта.");
                    this.changed();
                },
                error: (error) => {
                    const errorMessage = error?.error || error?.message || 'Произошла ошибка при завершении экспертизы';
                    if (error?.status === 400) {
                        this._toasty.error('Невозможно завершить экспертизу. Состояние могло измениться. Обновите страницу.');
                        this.changed();
                    } else {
                        this._toasty.error(errorMessage);
                    }
                }
            });
        });
    }

    rollbackExpertReview() {
        this._dialogService.showConfirmDialog(
            'Доработка экспертного заключения',
            `Отправить экспертное заключение на доработку экспертом ${this._personPipe.transform(this.expertReview().expert)}"?`
        ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this._reviewService.rollbackReview(this.expertReview())
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                next: (res) => {
                    this.applyReview(res);
                    this._toasty.success("Отправили заключение на доработку.");
                    this.changed();
                },
                error: (error) => {
                    const errorMessage = error?.error || error?.message || 'Произошла ошибка при отправке на доработку';
                    if (error?.status === 400) {
                        this._toasty.error('Невозможно отправить на доработку. Состояние могло измениться. Обновите страницу.');
                        this.changed();
                    } else {
                        this._toasty.error(errorMessage);
                    }
                }
            });
        });
    }

    closeForm() {
        this.expertReviewForm()?.close();
    }

    closeModal() {
        this.reviewFormModal()?.hide();
    }

    private applyReview(review: ExpertReviewDto) {
        // Создаём копию чтобы не мутировать входящий объект
        const reviewCopy = { ...review };
        this._reviewService.prepareReview(reviewCopy);
        reviewCopy.badge = ExpertReviewStateBadge[reviewCopy.state];
        reviewCopy.expectedBadge = ExpertReviewStateBadge[reviewCopy.expectedState];
        this.expertReview.set(reviewCopy);
    }

    private updateExpertReview(update: (review: ExpertReviewDto) => ExpertReviewDto) {
        const current = this.expertReview();
        if (!current) {
            return;
        }
        this.expertReview.set(update({ ...current }));
    }
}
