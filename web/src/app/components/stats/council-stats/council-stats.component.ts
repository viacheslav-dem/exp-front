import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injectable, OnInit, ElementRef, AfterViewInit, effect, input, viewChild, signal} from "@angular/core";
import {toSignal} from "@angular/core/rxjs-interop";
import {StatsService} from "@app/services/stats.service";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {CouncilPlainDto} from "@app/dto/CouncilPlainDto";
import {DataService} from "@app/services/data.service";
import {Role} from "@app/pipes/role.pipe";
import {AuthService} from "@app/services/auth.service";
import {CouncilPipe} from "@app/pipes/council.pipe";
import {
  ProjectListFromStatsComponent
} from "@app/components/stats/project-list-from-stats/project-list-from-stats.component";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {CouncilStatsResponseDTO} from "@app/dto/response/CouncilStatsResponseDTO";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-council-stats',
    templateUrl: './council-stats.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.stats) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
@Injectable({ providedIn: 'root' })
export class CouncilStatsComponent implements OnInit, AfterViewInit {

  Role = Role;
  role: Role | undefined;

  dateFrom: number = dayjs().subtract(1, 'year').valueOf();
  dateTo: number = dayjs().valueOf();

  dateFromValue: Date = new Date(this.dateFrom);
  dateToValue: Date = new Date(this.dateTo);
  
  dateFromInput = viewChild<ElementRef<HTMLInputElement>>('dateFromInput');
  dateToInput = viewChild<ElementRef<HTMLInputElement>>('dateToInput');
  
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    dateInputFormat: 'MM.yyyy', // для ngx-bootstrap (date-fns формат)
    containerClass: 'theme-default',
    showWeekNumbers: false
  };

  _council: CouncilPlainDto;
  allCouncils = toSignal(this.councilService.getCouncils(), { initialValue: [] as CouncilPlainDto[] });
  statsV2 = signal<CouncilStatsResponseDTO[]>([]);

  listProjectsFromStats = viewChild(ProjectListFromStatsComponent);

  councilToString: Function;

  constructor(private statsService: StatsService,
              private councilService: DataService,
              private authService: AuthService,
              private dialogService: DialogService,
              private cdr: ChangeDetectorRef,
              private toasty: GlobalToastyService,
              private councilPipe: CouncilPipe) {
    dayjs.extend(customParseFormat);
    this.councilToString = council => councilPipe.transform(council);
  }

  private _councilsProcessed = false;

  private readonly councilsEffect = effect(() => {
    const councils = this.allCouncils();
    // Ждем загрузки советов и инициализации роли
    if (councils.length === 0 || this.role === undefined) {
      return;
    }

    // Обрабатываем только один раз после загрузки
    if (this._councilsProcessed) {
      return;
    }

    // Для BUREAU_CHAIRMAN не нужно устанавливать совет
    if (this.role === Role.BUREAU_CHAIRMAN) {
      this._councilsProcessed = true;
      return;
    }

    // Устанавливаем первый совет по умолчанию, если не установлен
    if (this._council == null && councils.length > 0) {
      this.council = councils[0];
    }

    // Загружаем данные если совет установлен
    if (this._council) {
      this._councilsProcessed = true;
      this.update();
    }
    this.cdr?.markForCheck?.();
  });

  ngOnInit(): void {
    this.role = this.authService.getCurrRole();

    // Для BUREAU_CHAIRMAN можно загрузить данные сразу: данные не зависят от выбора совета.
    if (this.role == Role.BUREAU_CHAIRMAN) {
      this.update();
    }
  }

  ngAfterViewInit(): void {
    // Обновляем отображение после инициализации
    requestAnimationFrame(() => {
      this.updateInputDisplay();
      this.cdr?.markForCheck?.();
    });
  }

  private updateInputDisplay(): void {
    const dateFromInputEl = this.dateFromInput();
    if (dateFromInputEl?.nativeElement && this.dateFromValue) {
      const formatted = dayjs(this.dateFromValue).locale('ru').format('MM.YYYY');
      if (dateFromInputEl.nativeElement.value !== formatted) {
        dateFromInputEl.nativeElement.value = formatted;
      }
    }
    const dateToInputEl = this.dateToInput();
    if (dateToInputEl?.nativeElement && this.dateToValue) {
      const formatted = dayjs(this.dateToValue).locale('ru').format('MM.YYYY');
      if (dateToInputEl.nativeElement.value !== formatted) {
        dateToInputEl.nativeElement.value = formatted;
      }
    }
  }

  update() {
    let dateToExclusive = dayjs(this.dateTo).add(1, 'month').valueOf();
    if (this.role == Role.BUREAU_CHAIRMAN) {
      this.statsService.getCouncilStatsForBureauChairman(this.dateFrom, dateToExclusive).subscribe({
        next: (res) => {
          // Convert CouncilStatsDto[] to CouncilStatsResponseDTO[] for compatibility with charts
          const convertedStats = res.map(dto => {
            const responseDto = new CouncilStatsResponseDTO();
            responseDto.id = dto.id;
            responseDto.startDate = dto.startDate;
            responseDto.council = dto.council;
            responseDto.finishedProjects = dto.finishedProjects;
            responseDto.projectsAccepted = dto.projectsAccepted;
            responseDto.projectsRejected = dto.projectsRejected;
            responseDto.projectsReceived = dto.projectsReceived;
            responseDto.projectsNotFinished = dto.projectsNotFinished;
            responseDto.projectsReturned = dto.projectsReturned;
            responseDto.projectsReturnedWithoutExpertise = dto.projectsReturnedWithoutExpertise;
            responseDto.projectsOverdue = dto.projectsOverdue;
            responseDto.examinationTermsStats = dto.examinationTermsStats;
            responseDto.overdueDaysProject = 0; // Default value, not available in CouncilStatsDto
            return responseDto;
          });
          this.statsV2.set(convertedStats);
          this.cdr?.markForCheck?.();
        },
        error: (err) => {
          console.error('Ошибка при загрузке статистики для председателя бюро:', err);
          this.toasty.err(err.status || 500, err.error?.message || 'Не удалось загрузить статистику. Проверьте, что у вас есть связанное бюро.');
          this.statsV2.set([]); // Очищаем статистику при ошибке
          this.cdr?.markForCheck?.();
        }
      });
    } else if (this._council) {
      // this.statsService.getCouncilStats(this._council, this.dateFrom, dateToExclusive).subscribe(res => {
      //   this.stats = res
      this.statsService.getCouncilStats(this._council, this.dateFrom, dateToExclusive).subscribe({
        next: (res) => {
          this.statsV2.set(res);
          this.cdr?.markForCheck?.();
        },
        error: (err) => {
          console.error('Ошибка при загрузке статистики по ГЭС:', err);
          this.toasty.err(err.status || 500, err.error?.message || 'Не удалось загрузить статистику.');
          this.statsV2.set([]); // Очищаем статистику при ошибке
          this.cdr?.markForCheck?.();
        }
      });
    }
  }

  changeDateTo(date: Date) {
    if (date) {
      this.dateTo = dayjs(date).startOf('month').valueOf();
      this.dateToValue = new Date(this.dateTo);
      this.update();
      // Обновляем отображение после изменения даты
      requestAnimationFrame(() => {
        const dateToInputEl = this.dateToInput();
        if (dateToInputEl?.nativeElement) {
          const formatted = dayjs(date).locale('ru').format('MM.YYYY');
          dateToInputEl.nativeElement.value = formatted;
        }
        this.cdr?.markForCheck?.();
      });
    }
  }

  changeDateFrom(date: Date) {
    if (date) {
      this.dateFrom = dayjs(date).startOf('month').valueOf();
      this.dateFromValue = new Date(this.dateFrom);
      this.update();
      // Обновляем отображение после изменения даты
      requestAnimationFrame(() => {
        const dateFromInputEl = this.dateFromInput();
        if (dateFromInputEl?.nativeElement) {
          const formatted = dayjs(date).locale('ru').format('MM.YYYY');
          dateFromInputEl.nativeElement.value = formatted;
          this.cdr?.markForCheck?.();
        }
      });
    }
  }

  readonly councilInput = input<CouncilPlainDto>(undefined, { alias: 'council' });

  get council(): CouncilPlainDto {
    return this._council;
  }

  set council(value: CouncilPlainDto) {
    this._council = value;
  }

  private readonly councilEffect = effect(() => {
    const council = this.councilInput();
    if (!council) {
      return;
    }
    this._council = council;
    this.update();
  });

  showListProjectsFromStats(type, month) {
    const listComponent = this.listProjectsFromStats();
    if (!listComponent) {
      console.warn('ProjectListFromStatsComponent не найден');
      return;
    }
    if (!this._council?.id) {
      console.warn('ГЭС не выбран');
      return;
    }
    
    let startOfMonthValue: number;
    let endOfMonthValue: number;
    
    // Пытаемся найти исходный timestamp из статистики по отформатированной строке
    // MonthYearPipe форматирует как "MMMM YYYY" с первой заглавной буквой
    const stats = this.statsV2();
    const foundStat = stats.find(stat => {
      const formatted = dayjs(stat.startDate).locale('ru').format('MMMM YYYY');
      // Сравниваем без учета регистра первой буквы
      const formattedLower = formatted.charAt(0).toLowerCase() + formatted.slice(1);
      const monthLower = month.charAt(0).toLowerCase() + month.slice(1);
      return formatted === month || formattedLower === monthLower;
    });
    
    if (foundStat) {
      // Используем исходный timestamp из статистики - это самый надежный способ
      const monthDate = dayjs(foundStat.startDate);
      startOfMonthValue = monthDate.startOf('month').valueOf();
      endOfMonthValue = monthDate.endOf('month').valueOf();
    } else {
      // Fallback: парсим строку категории графика (формат "MMMM YYYY" на русском, например "Январь 2025")
      const parsedMonth = dayjs(month, 'MMMM YYYY', 'ru', true); // strict mode
      
      // Проверяем, что парсинг успешен
      if (!parsedMonth.isValid()) {
        console.error('Не удалось распарсить дату из категории графика:', month);
        this.toasty.err(400, `Не удалось обработать дату: ${month}`);
        return;
      }
      
      startOfMonthValue = parsedMonth.startOf('month').valueOf();
      endOfMonthValue = parsedMonth.endOf('month').valueOf();
    }
    
    // Дополнительная проверка на валидность timestamp
    if (isNaN(startOfMonthValue) || isNaN(endOfMonthValue)) {
      console.error('Получены невалидные значения дат:', { startOfMonthValue, endOfMonthValue, month });
      this.toasty.err(400, `Не удалось обработать дату: ${month}`);
      return;
    }
    listComponent.show(type, this._council.id, startOfMonthValue, endOfMonthValue);
  }

  hideListProjectsFromStats(): void {
    this.listProjectsFromStats()?.hide();
  }

  updateCouncilStatsForLastYear() {

    this.dialogService.showConfirmDialog('Обновление статистики по ГЭС за последний год',
        `Обновление может занять продолжительное время. Вы уверены, что хотите обновить статистику?`,
        'Рекомендуется запускать обновление в конце рабочего дня.')
        .subscribe(() => {
          this.statsService.updateCouncilStatsForLastYear().subscribe();
          this.toasty.success("Обновление статистики за последний год запущено.");
        });
  }

  updateCouncilStatsForAllTime() { //since 01.2018

    this.dialogService.showConfirmDialog('Обновление статистики по ГЭС за все время',
        `Обновление может занять продолжительное время. Вы уверены, что хотите обновить статистику?`,
        'Рекомендуется запускать обновление в конце рабочего дня.')
        .subscribe(() => {
          this.statsService.updateCouncilStatsForAllTime().subscribe();
          this.toasty.success("Обновление статистики за все время запущено.");
        });
  }
}
