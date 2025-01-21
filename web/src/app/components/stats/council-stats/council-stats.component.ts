import {Component, ElementRef, Injectable, Input, OnInit, ViewChild} from "@angular/core";
import {StatsService} from "@app/services/stats.service";
import * as moment from "moment";
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

  dateFrom: number = moment().add(-1, 'year').valueOf();
  dateTo: number = moment().valueOf();

  _council: CouncilPlainDto;
  allCouncils: CouncilPlainDto[];
  stats: CouncilStatsDto[];
  statsV2: CouncilStatsResponseDTO[];

  @ViewChild("dateFromInput") dateFromInput: ElementRef;
  @ViewChild("dateToInput") dateToInput: ElementRef;

  @ViewChild(ProjectListFromStatsComponent) public listProjectsFromStats: ProjectListFromStatsComponent;

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
    this.dateFromInput.nativeElement.onchange = (e) => this.changeDateFrom(e.target.value);
    this.dateToInput.nativeElement.onchange = (e) => this.changeDateTo(e.target.value);
  }

  update() {
    let dateToExclusive = moment(this.dateTo).add(1, 'month').valueOf();
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

  changeDateTo(dateTo) {

    this.dateTo = moment(dateTo, 'MMMM YYYY').valueOf();
    this.update();
  }

  changeDateFrom(dateFrom) {

    this.dateFrom = moment(dateFrom, 'MMMM YYYY').valueOf();
    this.update();
  }

  @Input() set council(council: CouncilPlainDto) {
    this._council = council;
    this.update();
  }

  showListProjectsFromStats(type, month) {
    let monthValue = moment(month, 'MMMM YYYY').valueOf();
    let startOfMonth = moment(monthValue).startOf('month').format('DD-MMMM-YYYY hh:mm');
    let endOfMonth   = moment(monthValue).endOf('month').format('DD-MMMM-YYYY hh:mm');

    let startOfMonthValue = moment(startOfMonth, 'DD-MMMM-YYYY hh:mm').valueOf();
    let endOfMonthValue = moment(endOfMonth, 'DD-MMMM-YYYY hh:mm').valueOf();

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
