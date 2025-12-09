import {Component, Injectable, Input, OnInit, ViewChild} from "@angular/core";
import {StatsService} from "@app/services/stats.service";
import {subYears, getTime, addMonths, startOfMonth, endOfMonth, format, parse} from 'date-fns';
import {ru} from 'date-fns/locale';
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
})
@Injectable({ providedIn: 'root' })
export class CouncilStatsComponent implements OnInit {

  Role = Role;
  role: Role;

  dateFrom: number = getTime(subYears(new Date(), 1));
  dateTo: number = getTime(new Date());

  dateFromValue: Date = new Date(this.dateFrom);
  dateToValue: Date = new Date(this.dateTo);
  
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    dateInputFormat: 'MM.yyyy',
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

  update() {
    let dateToExclusive = getTime(addMonths(new Date(this.dateTo), 1));
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
      this.dateTo = getTime(startOfMonth(date));
      this.update();
    }
  }

  changeDateFrom(date: Date) {
    if (date) {
      this.dateFrom = getTime(startOfMonth(date));
      this.update();
    }
  }

  @Input() set council(council: CouncilPlainDto) {
    this._council = council;
    this.update();
  }

  showListProjectsFromStats(type, month) {
    let monthValue = getTime(new Date(month));
    let startOfMonthDate = startOfMonth(new Date(monthValue));
    let endOfMonthDate = endOfMonth(new Date(monthValue));
    let startOfMonthStr = format(startOfMonthDate, 'dd-MMMM-yyyy HH:mm', {locale: ru});
    let endOfMonthStr = format(endOfMonthDate, 'dd-MMMM-yyyy HH:mm', {locale: ru});

    let startOfMonthValue = getTime(parse(startOfMonthStr, 'dd-MMMM-yyyy HH:mm', new Date(), {locale: ru}));
    let endOfMonthValue = getTime(parse(endOfMonthStr, 'dd-MMMM-yyyy HH:mm', new Date(), {locale: ru}));

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
