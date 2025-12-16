import {Component, ChangeDetectionStrategy, inject, signal, computed} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule} from '@angular/common';
import {Subject, switchMap, catchError, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import dayjs from 'dayjs';
import {StatsService} from "@app/services/stats.service";
import {CouncilStatsResponseDTO} from "@app/dto/response/CouncilStatsResponseDTO";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'app-result-fun',
    templateUrl: './result-fun.component.html',
    styles: [],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule]
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

  readonly councilStatsResponseDTOs = signal<CouncilStatsResponseDTO[]>([]);
  readonly resultCouncilStatsResponseDTO = signal<CouncilStatsResponseDTO>(new CouncilStatsResponseDTO());

  constructor() {
    // Инициализация данных при загрузке
    this.updateResFun();
    
    // Подписка на обновления с автоматической отпиской
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
    const date = new Date(this._year(), this._monthIndex(), 1);
    const dateToExclusive = dayjs(date).valueOf();
    
    return this.statsService.getResFunMonth(dateToExclusive).pipe(
      tap((res: CouncilStatsResponseDTO[]) => {
        this.councilStatsResponseDTOs.set(res);
        this.updateResultStats(res);
        this._isButtonDisabled.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        this.showStatus500(err);
        this._isButtonDisabled.set(false);
        return of([]);
      })
    );
  }

  private loadYearData() {
    const date = new Date(this._year(), 0, 1);
    const dateFrom = dayjs(date).valueOf();
    const dateTo = dayjs(date).add(1, 'year').valueOf();
    
    return this.statsService.getResFunYear(dateFrom, dateTo).pipe(
      tap((res: CouncilStatsResponseDTO[]) => {
        this.councilStatsResponseDTOs.set(res);
        this.updateResultStats(res);
        this._isButtonDisabled.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        this.showStatus500(err);
        this._isButtonDisabled.set(false);
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
    this.resultCouncilStatsResponseDTO.set(result);
  }

  private showStatus500(err: HttpErrorResponse) {
    if (err.status === 500) {
      this.councilStatsResponseDTOs.update(stats => {
        stats.forEach(cs => {
          cs.projectsReceived = 0;
          cs.finishedProjects = 0;
          cs.projectsNotFinished = 0;
          cs.projectsOverdue = 0;
        });
        return stats;
      });
      
      const emptyResult = new CouncilStatsResponseDTO();
      emptyResult.projectsReceived = 0;
      emptyResult.finishedProjects = 0;
      emptyResult.projectsNotFinished = 0;
      emptyResult.projectsOverdue = 0;
      this.resultCouncilStatsResponseDTO.set(emptyResult);
    }
  }
}
