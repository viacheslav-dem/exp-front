import {Component, ChangeDetectionStrategy, inject, signal, computed} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule} from '@angular/common';
import {Subject, switchMap, catchError, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import dayjs from 'dayjs';
import {StatsService} from "@app/services/stats.service";
import {CouncilStatsResponseDTO} from "@app/dto/response/CouncilStatsResponseDTO";
import {HttpErrorResponse} from "@angular/common/http";
import {DropdownToggleDirective} from "@app/components/common-components/dropdown/dropdown-toggle.directive";

@Component({
    selector: 'app-result-fun',
    templateUrl: './result-fun.component.html',
    styles: [],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, DropdownToggleDirective]
})
export class ResultFunComponent {

  readonly months: readonly string[] = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  
  private readonly statsService = inject(StatsService);
  private readonly refreshTrigger$ = new Subject<void>();

  private readonly _monthIndex = signal<number>(new Date().getMonth());
  
  private readonly _year = signal<number>(new Date().getFullYear());
  
  private readonly _isButtonMonthDisabled = signal<boolean>(true);
  private readonly _monthAndYear = signal<number>(1);
  
  readonly years = signal<number[]>((() => {
    const currentDate = new Date();
    const years: number[] = [];
    for (let i = 2020; i <= currentDate.getFullYear(); i++) {
      years.push(i);
    }
    return years;
  })());

  readonly monthIndex = this._monthIndex.asReadonly();
  readonly year = this._year.asReadonly();
  readonly isButtonMonthDisabled = this._isButtonMonthDisabled.asReadonly();
  readonly monthAndYear = this._monthAndYear.asReadonly();
  
  readonly mouth = computed(() => this.months[this._monthIndex()]);
  
  private readonly _isButtonDisabled = signal<boolean>(false);
  readonly isButtonDisabled = this._isButtonDisabled.asReadonly();
  
  private readonly _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  readonly councilStatsResponseDTOs = signal<CouncilStatsResponseDTO[]>([]);
  readonly resultCouncilStatsResponseDTO = signal<CouncilStatsResponseDTO>(this.createEmptyStats());
  
  private createEmptyStats(): CouncilStatsResponseDTO {
    const empty = new CouncilStatsResponseDTO();
    empty.projectsReceived = 0;
    empty.projectsNotFinished = 0;
    empty.projectsOverdue = 0;
    empty.overdueDaysProject = 0;
    empty.finishedProjects = 0;
    return empty;
  }

  constructor() {
    // Сначала настраиваем подписку на обновления
    this.refreshTrigger$.pipe(
      switchMap(() => {
        if (this._isButtonMonthDisabled()) {
          return this.loadMonthData();
        } else {
          return this.loadYearData();
        }
      }),
      takeUntilDestroyed()
    ).subscribe();
    
    // Затем инициализируем загрузку данных
    this.updateResFun();
  }

  updateResFun() {
    this.refreshTrigger$.next();
  }

  updateResFunMonth(i: number) {
    this._monthIndex.set(i);
    this._isButtonDisabled.set(true);
    this.refreshTrigger$.next();
  }

  updateResFunYear(y: number) {
    this._year.set(y);
    this._isButtonDisabled.set(true);
    this.refreshTrigger$.next();
  }

  onMonthAndYearChange(value: number) {
    if (value === 1 && !this._isButtonMonthDisabled()) {
      this._monthAndYear.set(1);
      this._isButtonMonthDisabled.set(true);
      this._isButtonDisabled.set(true);
    } else if (value === 2 && this._isButtonMonthDisabled()) {
      this._monthAndYear.set(2);
      this._isButtonMonthDisabled.set(false);
      this._isButtonDisabled.set(true);
    }
    this.refreshTrigger$.next();
  }

  private loadMonthData() {
    // Начало месяца: 1 число выбранного месяца, 00:00:00 UTC
    // Используем UTC для избежания проблем с часовыми поясами
    const dateToExclusive = Date.UTC(this._year(), this._monthIndex(), 1);
    
    this._isLoading.set(true);
    
    return this.statsService.getResFunMonth(dateToExclusive).pipe(
      tap((res: CouncilStatsResponseDTO[]) => {
        this.councilStatsResponseDTOs.set(res);
        this.updateResultStats(res);
        this._isButtonDisabled.set(false);
        this._isLoading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        console.error('Error loading month data:', err);
        this.showStatus500(err);
        this._isButtonDisabled.set(false);
        this._isLoading.set(false);
        return of([]);
      })
    );
  }

  private loadYearData() {
    // Начало года: 1 января выбранного года, 00:00:00
    // Используем UTC для избежания проблем с часовыми поясами
    const dateFrom = Date.UTC(this._year(), 0, 1);
    // Конец года: 1 января следующего года (включительно для LessThanEqual)
    // Бэкенд использует LessThanEqual, что включает все записи с endDate <= dateTo
    const dateTo = Date.UTC(this._year() + 1, 0, 1);
    
    this._isLoading.set(true);
    
    return this.statsService.getResFunYear(dateFrom, dateTo).pipe(
      tap((res: CouncilStatsResponseDTO[]) => {
        this.councilStatsResponseDTOs.set(res);
        this.updateResultStats(res);
        this._isButtonDisabled.set(false);
        this._isLoading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        console.error('Error loading year data:', err);
        this.showStatus500(err);
        this._isButtonDisabled.set(false);
        this._isLoading.set(false);
        return of([]);
      })
    );
  }

  private updateResultStats(stats: CouncilStatsResponseDTO[]) {
    const result = new CouncilStatsResponseDTO();
    result.projectsReceived = stats.reduce((acc, obj) => acc + (obj.projectsReceived ?? 0), 0);
    result.projectsOverdue = stats.reduce((acc, obj) => acc + (obj.projectsOverdue ?? 0), 0);
    result.finishedProjects = stats.reduce((acc, obj) => acc + (obj.finishedProjects ?? 0), 0);
    result.projectsNotFinished = stats.reduce((acc, obj) => acc + (obj.projectsNotFinished ?? 0), 0);
    result.overdueDaysProject = stats.reduce((acc, obj) => acc + (obj.overdueDaysProject ?? 0), 0);
    // Инициализируем все поля, чтобы избежать undefined
    result.id = 0;
    result.projectsAccepted = 0;
    result.projectsRejected = 0;
    result.projectsReturned = 0;
    result.projectsReturnedWithoutExpertise = 0;
    this.resultCouncilStatsResponseDTO.set(result);
  }

  private showStatus500(err: HttpErrorResponse) {
    if (err.status === 500) {
      this.councilStatsResponseDTOs.set([]);
      this.resultCouncilStatsResponseDTO.set(this.createEmptyStats());
    }
  }
}
