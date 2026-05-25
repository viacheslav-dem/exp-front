import {Component, input, output, ChangeDetectionStrategy, inject, DestroyRef, effect, signal, viewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule} from '@angular/common';
import {Role} from "app/pipes/role.pipe";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {SearchExpertComponent} from "@app/components/search/search-person/search-expert/search-expert.component";
import {ExpertReviewDto} from "@app/dto/ExpertReviewDto";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {PersonFullNamePipe} from "@app/pipes/person-full-name.pipe";
import {ProjectService} from "@app/services/project.service";
import {ProjectDto} from "@app/dto/ProjectDto";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {switchMap, tap, catchError} from 'rxjs/operators';
import {of, timer} from 'rxjs';
import {SearchModule} from "@app/components/search/search.module";
import {CommonComponentsModule} from "@app/components/common-components/components.module";
import {ExpertReviewModule} from "@app/components/expert-review/expert-review.module";
import {ExpertReviewState} from "@app/pipes/review-state.pipe";
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";
import {DialogResult} from "@app/components/dialogs/dialog-result";
import {ManualSelectionRequestDto} from "@app/dto/ManualSelectionRequestDto";

@Component({
    selector: 'app-expert-review-list',
    templateUrl: './expert-review-list.component.html',
    styleUrls: ['expert-review-list.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SearchModule, CommonComponentsModule, ExpertReviewModule]
})
export class ExpertReviewListComponent {

  Role = Role;

  readonly expertReviews = input<ExpertReviewDto[]>([]);
  readonly role = input<string | undefined>(undefined);
  readonly project = input<ProjectDto | undefined>(undefined);
  readonly onChanged = output<ExpertReviewDto[]>();
  readonly canChooseExperts = input<boolean | undefined>(undefined);

  public readonly searchExpertComponent = viewChild.required(SearchExpertComponent);

  private readonly _toasty = inject(GlobalToastyService);
  private readonly _projectService = inject(ProjectService);
  private readonly _dialogService = inject(DialogService);
  private readonly _personPipe = inject(PersonFullNamePipe);
  private readonly _destroyRef = inject(DestroyRef);

  // Состояние загрузки для автоматического выбора эксперта
  isAutomaticSelectionLoading = signal(false);

  isAutomaticSelectionMode = signal(true);

  // Предыдущее состояние списка для отслеживания изменений
  // Убрали _previousRejectedIds, так как отклонение обрабатывается бэкендом
  private _previousExpiredIds = new Set<number>();

  private _autoSelectScheduled = false;

  private _isAutomaticSelectionDisabled = false;

  _isManualRequestDisabled = false;

  _manualSelectionRequests  = signal<ManualSelectionRequestDto[]>([]);

  constructor() {
    // Отслеживаем изменения списка экспертных оценок для автоматического выбора при истечении срока
    // НЕ отслеживаем отклонение через rejectProject, так как бэкенд сам обрабатывает это через reAssignExpert
    effect(() => {
      const reviews = this.expertReviews();
      const currentRole = this.role();
      if (this.project().manualSelectionRequests.length != 0) {
        if (this._manualSelectionRequests().length < this.project().manualSelectionRequests.length) {
          this._manualSelectionRequests.set(this.project().manualSelectionRequests);
        }
        if (this.project().manualSelectionRequests.at(-1).isConfirmed) {
          this.isAutomaticSelectionMode.set(false);
        }
        if (this._manualSelectionRequests().length != 0) {
          this._isManualRequestDisabled = this._manualSelectionRequests().at(-1).onConfirmation
              || this._manualSelectionRequests().at(-1).isConfirmed
        }
      }
      // Для BUREAU_CHAIRMAN проверяем необходимость автоматического выбора
      // Автоматически выбираем нового эксперта только при истечении срока подтверждения
      // Отклонение обрабатывается бэкендом через reAssignExpert в rejectProject
      if ((currentRole === Role.BUREAU_CHAIRMAN || currentRole === Role.SECTION_CHAIRMAN) && reviews.length > 0) {
        const rejected = reviews.filter(item => item.state === ExpertReviewState.REJECTED).length;
        const accepted = reviews.filter(item => item.state === ExpertReviewState.PROJECT_ACCEPTED).length;
        const projectRejected = reviews.filter(item => item.state === ExpertReviewState.PROJECT_REJECTED).length;
        const inProgress = reviews.filter(item =>
          item.state === ExpertReviewState.ON_EXAMINATION ||
          item.state === ExpertReviewState.ON_EXPERT_CONFIRMATION ||
          item.state === ExpertReviewState.ON_GKNT_CONFIRMATION
        ).length;
        // Переключаем на ручной выбор если:
        // - мало экспертов или большинство отклонили назначение (REJECTED)
        // - ситуация 50/50: одинаковое кол-во положительных и отрицательных заключений, нет экспертов в процессе
        const isFiftyFifty = accepted > 0 && accepted === projectRejected && inProgress === 0;
        if (reviews.length < 2 || rejected > reviews.length - 2 || isFiftyFifty) {
          this.isAutomaticSelectionMode.set(false);
        }

        if (accepted >= 2) {
          this._isManualRequestDisabled = true;
        }

        const currentExpiredIds = new Set(
          reviews
            .filter(r => r.state === ExpertReviewState.ON_EXPERT_CONFIRMATION && r.red)
            .map(r => r.id)
        );
        
        // Проверяем, появились ли новые просроченные эксперты (истечение срока подтверждения)
        const hasNewExpired = Array.from(currentExpiredIds).some(id => !this._previousExpiredIds.has(id));
        
        // Используем флаг для предотвращения множественных вызовов
        if (hasNewExpired && !this._autoSelectScheduled) {
          this._autoSelectScheduled = true;
          // Отложенный вызов вне контекста effect чтобы избежать циклов
          queueMicrotask(() => {
            this._autoSelectScheduled = false;
            this.checkAndAutoSelectExpert(reviews);
          });
        }
        this._previousExpiredIds = currentExpiredIds;
      }
    });
  }

  changed() {
    this.onChanged.emit(this.expertReviews());
  }

  onSelectedExpert(expert: PersonPlainDto) {
    const project = this.project();
    if (!project) {
      return;
    }

    this.searchExpertComponent()?.hide();
    
    this._dialogService.showConfirmDialog(
      'Выбор эксперта',
      `Назначить эксперта "${this._personPipe.transform(expert)}" на объект экспертизы "${project.title}"?`,
      'Эксперт получит приглашение поучаствовать в экспертизе.'
    ).pipe(
      switchMap(() => this._projectService.attachExpert(project, expert.id)),
      tap((res: ExpertReviewDto) => {
        this._toasty.success("Эксперт прикреплен.");
        const currentReviews = this.expertReviews();
        const updatedReviews = [...currentReviews, res];
        this.onChanged.emit(updatedReviews);
      }),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe();
  }

  // Проверяет, заблокирована ли кнопка автоматического выбора
  // Блокируется, если уже есть эксперты (как в оригинальной реализации от 12.12.2025)
  isAutomaticSelectionDisabled(): boolean {

    if (this._manualSelectionRequests().length != 0) {
      this._isAutomaticSelectionDisabled = this._manualSelectionRequests().at(-1).onConfirmation
          || this._manualSelectionRequests().at(-1).isConfirmed
    }
    return this.expertReviews().length !== 0 || this._isAutomaticSelectionDisabled;
  }

  automaticExpertSelection() {
    const project = this.project();
    if (!project?.id) {
      return;
    }

    this.isAutomaticSelectionLoading.set(true);

    // Оригинальная логика из коммита 82eafcb от 12.12.2025: просто добавляем результат к списку
    this._projectService.automaticExpertSelection(project.id).pipe(
      tap((res: ExpertReviewDto[]) => {
        this.isAutomaticSelectionLoading.set(false);
        const currentReviews = this.expertReviews();
        const updatedReviews = [...currentReviews, ...res];
        if (updatedReviews.length < 2) {
          this.isAutomaticSelectionMode.set(false);
          this._toasty.warn("Нет доступных экспертов для автоматического выбора. Пожалуйста, выберите эксперта вручную.")
        }
        this.onChanged.emit(updatedReviews);
      }),
      catchError((error) => {
        this.isAutomaticSelectionLoading.set(false);
        // Извлекаем сообщение об ошибке из ответа сервера
        let errorMessage = "Ошибка при автоматическом выборе экспертов";
        
        if (error?.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.error) {
            errorMessage = error.error.error;
          }
        }
        
        // Проверяем, является ли ошибка связанной с пустым списком
        if (errorMessage.includes('пуст') || errorMessage.includes('Список пуст') || 
            errorMessage.includes('недоступен') || error?.status === 404) {
          errorMessage = "Нет доступных экспертов для автоматического выбора. Пожалуйста, выберите эксперта вручную.";
        }
        this.isAutomaticSelectionMode.set(false);
        this._toasty.error(errorMessage);
        return of([]);
      }),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe();
  }

  // Проверяет необходимость автоматического выбора нового эксперта при истечении срока подтверждения
  // Отклонение эксперта обрабатывается бэкендом через reAssignExpert в rejectProject
  private checkAndAutoSelectExpert(reviews: ExpertReviewDto[]): void {
    const project = this.project();
    if (!project?.id) {
      return;
    }

    // Проверяем, есть ли эксперты с истекшим сроком подтверждения (red флаг означает истечение срока)
    const hasExpiredConfirmation = reviews.some(review => 
      review.state === ExpertReviewState.ON_EXPERT_CONFIRMATION && review.red
    );

    if (hasExpiredConfirmation) {
      // Небольшая задержка перед автоматическим выбором, чтобы пользователь увидел изменение
      timer(1000).pipe(
        switchMap(() => this._projectService.automaticExpertSelection(project.id).pipe(
          tap((res: ExpertReviewDto[]) => {
            const currentReviews = this.expertReviews();
            const updatedReviews = [...currentReviews, ...res];
            this.onChanged.emit(updatedReviews);
          }),
          catchError((error) => {
            // Логируем ошибку, но не показываем пользователю, так как это автоматический процесс
            console.error("Ошибка при автоматическом выборе нового эксперта:", error);
            return of([]);
          })
        )),
        takeUntilDestroyed(this._destroyRef)
      ).subscribe();
    }
  }

  manualSelectionRequest() {
    this._dialogService.showConfirmDialogWithFields(
        [new ConfirmDialogField<string>('reason', 'Причина заявки')],
        'Отправление заявки',
        `Отправить заявку на ручной выбор эксперта на объект экспертизы "${this.project().title}"?`,
        'Пожалуйста, проверьте данные об эксперте, поскольку отменить действие будет невозможно.')
        .pipe(takeUntilDestroyed(this._destroyRef)).subscribe((dlgResult: DialogResult<any>) => {
      if (dlgResult.value.reason == null || dlgResult.value.reason == '') {
        this._toasty.error('Пожалуйста, укажите причину отклонения эксперта.');
        return;
      }
      const reason: string = dlgResult?.value?.reason || "";
      this._projectService.createRequestForManualSelection(this.project().id, reason).pipe(tap((res) => {
            this._isAutomaticSelectionDisabled = true;
            this._manualSelectionRequests.set(res);
            this._toasty.success("Заявка добавлена");
          }),
          takeUntilDestroyed(this._destroyRef)).subscribe()
    })
  }
}

