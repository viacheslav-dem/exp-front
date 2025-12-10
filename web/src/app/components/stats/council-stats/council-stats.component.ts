import {Component, Injectable, Input, OnInit, ViewChild, ElementRef, AfterViewInit} from "@angular/core";
import {StatsService} from "@app/services/stats.service";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
const customParseFormat = require('dayjs/plugin/customParseFormat');
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {CouncilStatsDto} from "@app/dto/CouncilStatsDto";
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
import {FormControl} from "@angular/forms";

@Component({
    selector: 'app-council-stats',
    templateUrl: './council-stats.component.html',
    standalone: false
})
@Injectable({ providedIn: 'root' })
export class CouncilStatsComponent implements OnInit, AfterViewInit {

  Role = Role;
  role: Role;

  dateFrom: number = dayjs().subtract(1, 'year').valueOf();
  dateTo: number = dayjs().valueOf();

  dateFromValue: Date = new Date(this.dateFrom);
  dateToValue: Date = new Date(this.dateTo);
  
  @ViewChild('dateFromInput', { static: false }) dateFromInput: ElementRef<HTMLInputElement>;
  @ViewChild('dateToInput', { static: false }) dateToInput: ElementRef<HTMLInputElement>;
  
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    dateInputFormat: 'MM.yyyy', // для ngx-bootstrap (date-fns формат)
    containerClass: 'theme-default',
    showWeekNumbers: false
  };

  _council: CouncilPlainDto;
  allCouncils: CouncilPlainDto[];
  stats: CouncilStatsDto[];
  statsV2: CouncilStatsResponseDTO[];

  @ViewChild(ProjectListFromStatsComponent, { static: false }) public listProjectsFromStats: ProjectListFromStatsComponent;

  councilToString: Function;

  constructor(private statsService: StatsService,
              private councilService: DataService,
              private authService: AuthService,
              private dialogService: DialogService,
              private toasty: GlobalToastyService,
              private councilPipe: CouncilPipe) {
    dayjs.extend(customParseFormat);
    this.councilToString = council => councilPipe.transform(council);
  }

  ngOnInit(): void {

    this.role = this.authService.getCurrRole();
    this.councilService.getCouncils().subscribe(res => {
      this.allCouncils = res;
      if (this._council == null) {
        this.council = this.allCouncils[0];
      }
    });
  }

  ngAfterViewInit(): void {
    // Обновляем отображение после инициализации
    requestAnimationFrame(() => {
      this.updateInputDisplay();
    });
  }

  private updateInputDisplay(): void {
    if (this.dateFromInput?.nativeElement && this.dateFromValue) {
      const formatted = dayjs(this.dateFromValue).locale('ru').format('MM.YYYY');
      if (this.dateFromInput.nativeElement.value !== formatted) {
        this.dateFromInput.nativeElement.value = formatted;
      }
    }
    if (this.dateToInput?.nativeElement && this.dateToValue) {
      const formatted = dayjs(this.dateToValue).locale('ru').format('MM.YYYY');
      if (this.dateToInput.nativeElement.value !== formatted) {
        this.dateToInput.nativeElement.value = formatted;
      }
    }
  }

  update() {
    let dateToExclusive = dayjs(this.dateTo).add(1, 'month').valueOf();
    if (this.role == Role.BUREAU_CHAIRMAN) {
      this.statsService.getCouncilStatsForBureauChairman(this.dateFrom, dateToExclusive).subscribe(res => this.stats = res);
    } else if (this._council) {
      // this.statsService.getCouncilStats(this._council, this.dateFrom, dateToExclusive).subscribe(res => {
      //   this.stats = res
      this.statsService.getCouncilStats(this._council, this.dateFrom, dateToExclusive).subscribe(res => {
        this.statsV2 = res
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
        if (this.dateToInput?.nativeElement) {
          const formatted = dayjs(date).locale('ru').format('MM.YYYY');
          this.dateToInput.nativeElement.value = formatted;
        }
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
        if (this.dateFromInput?.nativeElement) {
          const formatted = dayjs(date).locale('ru').format('MM.YYYY');
          this.dateFromInput.nativeElement.value = formatted;
        }
      });
    }
  }

  @Input() set council(council: CouncilPlainDto) {
    this._council = council;
    this.update();
  }

  showListProjectsFromStats(type, month) {
    let monthValue = dayjs(month).valueOf();
    let startOfMonthDate = dayjs(monthValue).startOf('month');
    let endOfMonthDate = dayjs(monthValue).endOf('month');
    let startOfMonthStr = startOfMonthDate.locale('ru').format('DD-MMMM-YYYY HH:mm');
    let endOfMonthStr = endOfMonthDate.locale('ru').format('DD-MMMM-YYYY HH:mm');

    let startOfMonthValue = dayjs(startOfMonthStr, 'DD-MMMM-YYYY HH:mm', 'ru').valueOf();
    let endOfMonthValue = dayjs(endOfMonthStr, 'DD-MMMM-YYYY HH:mm', 'ru').valueOf();

    this.listProjectsFromStats.show(type, this._council.id, startOfMonthValue, endOfMonthValue);
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
