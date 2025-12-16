import {Component, ViewChild, input, output, ChangeDetectionStrategy, inject, DestroyRef, effect, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule} from '@angular/common';
import {Role} from "app/pipes/role.pipe";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {SearchExpertComponent} from "@app/components/search/search-person/search-expert/search-expert.component";
import {ExpertReviewComponent} from "@app/components/expert-review/expert-review.component";
import {ExpertReviewDto} from "@app/dto/ExpertReviewDto";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {PersonFullNamePipe} from "@app/pipes/person-full-name.pipe";
import {ProjectService} from "@app/services/project.service";
import {ProjectDto} from "@app/dto/ProjectDto";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {switchMap, tap, catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {SearchModule} from "@app/components/search/search.module";
import {CommonComponentsModule} from "@app/components/common-components/components.module";
import {ExpertReviewModule} from "@app/components/expert-review/expert-review.module";
import {ExpertReviewState} from "@app/pipes/review-state.pipe";

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
  ExpertReviewState = ExpertReviewState;

  readonly expertReviews = input<ExpertReviewDto[]>([]);
  readonly role = input<string | undefined>(undefined);
  readonly project = input<ProjectDto | undefined>(undefined);
  readonly onChanged = output<ExpertReviewDto[]>();
  readonly canChooseExperts = input<boolean | undefined>(undefined);

  @ViewChild(SearchExpertComponent, { static: false }) public searchExpertComponent!: SearchExpertComponent;

  private readonly _toasty = inject(GlobalToastyService);
  private readonly _projectService = inject(ProjectService);
  private readonly _dialogService = inject(DialogService);
  private readonly _personPipe = inject(PersonFullNamePipe);
  private readonly _destroyRef = inject(DestroyRef);

  // Предыдущее состояние списка для отслеживания изменений
  // Убрали _previousRejectedIds, так как отклонение обрабатывается бэкендом
  private _previousExpiredIds = new Set<number>();

  constructor() {
    // Отслеживаем изменения списка экспертных оценок для автоматического выбора при истечении срока
    // НЕ отслеживаем отклонение через rejectProject, так как бэкенд сам обрабатывает это через reAssignExpert
    effect(() => {
      const reviews = this.expertReviews();
      const currentRole = this.role();
      
      // Для BUREAU_CHAIRMAN проверяем необходимость автоматического выбора
      // Автоматически выбираем нового эксперта только при истечении срока подтверждения
      // Отклонение обрабатывается бэкендом через reAssignExpert в rejectProject
      if (currentRole === Role.BUREAU_CHAIRMAN && reviews.length > 0) {
        const currentExpiredIds = new Set(
          reviews
            .filter(r => r.state === ExpertReviewState.ON_EXPERT_CONFIRMATION && r.red)
            .map(r => r.id)
        );
        
        // Проверяем, появились ли новые просроченные эксперты (истечение срока подтверждения)
        const hasNewExpired = Array.from(currentExpiredIds).some(id => !this._previousExpiredIds.has(id));
        
        if (hasNewExpired) {
          this.checkAndAutoSelectExpert(reviews);
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

    this.searchExpertComponent.hide();
    
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

  // Проверяет, нужно ли показывать автоматический выбор для BUREAU_CHAIRMAN
  isAutomaticSelectionMode(): boolean {
    return this.role() === Role.BUREAU_CHAIRMAN && this.canChooseExperts();
  }

  // Проверяет, заблокирована ли кнопка автоматического выбора
  // Блокируется, если уже есть эксперты (как в оригинальной реализации от 12.12.2025)
  isAutomaticSelectionDisabled(): boolean {
    return this.expertReviews().length !== 0;
  }

  automaticExpertSelection() {
    const project = this.project();
    if (!project?.id) {
      return;
    }

    // Оригинальная логика из коммита 82eafcb от 12.12.2025: просто добавляем результат к списку
    this._projectService.automaticExpertSelection(project.id).pipe(
      tap((res: ExpertReviewDto[]) => {
        const currentReviews = this.expertReviews();
        const updatedReviews = [...currentReviews, ...res];
        this.onChanged.emit(updatedReviews);
      }),
      catchError((error) => {
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
      setTimeout(() => {
        // Оригинальная логика: просто добавляем результат к списку
        this._projectService.automaticExpertSelection(project.id).pipe(
          tap((res: ExpertReviewDto[]) => {
            const currentReviews = this.expertReviews();
            const updatedReviews = [...currentReviews, ...res];
            this.onChanged.emit(updatedReviews);
          }),
          catchError((error) => {
            // Логируем ошибку, но не показываем пользователю, так как это автоматический процесс
            console.error("Ошибка при автоматическом выборе нового эксперта:", error);
            return of([]);
          }),
          takeUntilDestroyed(this._destroyRef)
        ).subscribe();
      }, 1000);
    }
  }

}

