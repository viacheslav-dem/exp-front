import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import * as dayjs from 'dayjs';
import {StatsService} from "@app/services/stats.service";
import {CouncilStatsResponseDTO} from "@app/dto/response/CouncilStatsResponseDTO";
import {EMPTY, Subscription, throwError} from "rxjs";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {CouncilStatsV2ResponseDTO} from "@app/dto/response/CouncilStatsV2ResponseDTO";

@Component({
  selector: 'app-result-fun',
  templateUrl: './result-fun.component.html',
  styles: []
})
export class ResultFunComponent implements OnInit, OnDestroy {

  public months: string[] = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  public mouth: string = this.months[0];
  public years: number[] = new Array<number>();
  public year: number = this.years[0];
  public isButtonDisabled = false;
  public isButtonMonthDisabled = true;
  public councilStatsResponseDTOs: Array<CouncilStatsResponseDTO> = new Array<CouncilStatsResponseDTO>();
  public resultCouncilStatsResponseDTO: CouncilStatsResponseDTO = new CouncilStatsResponseDTO();

  // public councilStatsV2ResponseDTOs: Array<CouncilStatsV2ResponseDTO> = new Array<CouncilStatsResponseDTO>();
  // public resultCouncilStatsV2ResponseDTO: CouncilStatsV2ResponseDTO = new CouncilStatsResponseDTO();

  private subscription: Subscription;
  public check: boolean = true;
  public monthAndYear: number = 1;

  constructor(private statsService: StatsService,
              private toasty: GlobalToastyService) { }

  ngOnInit() {
    const currentDate = new Date();
    for (let i = 2020, j = 0; i <= currentDate.getFullYear(); i++, j++){
      this.years[j] = i;
    }
    this.mouth = this.months[currentDate.getMonth()];
    this.year = currentDate.getFullYear();
    this.updateResFun()
  }

  updateResFun() {
    if(this.isButtonMonthDisabled){
      this.getResFunMonth();
    } else {
      this.getResFunYear();
    }
    this.isButtonDisabled = false;
  }

  updateResFunMonth(i: number) {
    this.isButtonDisabled = true;
    this.mouth = this.months[i];
  }

  updateResFunYear(y: number) {
    this.isButtonDisabled = true;
    this.year = y;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onMonthAndYearChange(number: number) {
    if(number == 1 && !this.isButtonMonthDisabled){
      this.monthAndYear = 1;
      this.isButtonMonthDisabled = true;
      this.isButtonDisabled = true;
    } else if (number == 2 && this.isButtonMonthDisabled)  {
      this.monthAndYear = 2;
      this.isButtonMonthDisabled = false;
      this.isButtonDisabled = true;
    }
  }

  // private getResFunMonth() {
  //   let date = new Date(this.year, this.months.indexOf(this.mouth), 1);
  //   let dateToExclusive = moment(date).valueOf();
  //   this.subscription = this.statsService.getResFunMonth(dateToExclusive).subscribe(
  //       res => {
  //         this.councilStatsResponseDTOs = res;
  //         this.resultCouncilStatsResponseDTO.projectsReceived =
  //             this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.projectsReceived,0);
  //         this.resultCouncilStatsResponseDTO.projectsOverdue =
  //             this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.projectsOverdue,0);
  //         this.resultCouncilStatsResponseDTO.finishedProjects =
  //             this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.finishedProjects,0);
  //         this.resultCouncilStatsResponseDTO.projectsNotFinished =
  //             this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.projectsNotFinished,0);
  //         this.resultCouncilStatsResponseDTO.overdueDaysProject =
  //             this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.overdueDaysProject,0);
  //       },
  //       err => {
  //         this.showStatus500(err);
  //       }
  //   );
  // }
  //
  // private getResFunYear() {
  //   let date = new Date(this.year, 0, 1);
  //
  //   let dateFrom = moment(date).valueOf();
  //   let dateTo = moment(date).add(1, 'year').valueOf();
  //   this.subscription = this.statsService.getResFunYear(dateFrom, dateTo).subscribe(
  //       res => {
  //         this.councilStatsResponseDTOs = res;
  //         this.resultCouncilStatsResponseDTO.projectsReceived =
  //             this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.projectsReceived,0);
  //         this.resultCouncilStatsResponseDTO.projectsOverdue =
  //             this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.projectsOverdue,0);
  //         this.resultCouncilStatsResponseDTO.finishedProjects =
  //             this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.finishedProjects,0);
  //         this.resultCouncilStatsResponseDTO.projectsNotFinished =
  //             this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.projectsNotFinished,0);
  //         this.resultCouncilStatsResponseDTO.overdueDaysProject =
  //             this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.overdueDaysProject,0);
  //       },
  //       err => {
  //           this.showStatus500(err);
  //       }
  //   );
  // }

  private getResFunMonth() {
    let date = new Date(this.year, this.months.indexOf(this.mouth), 1);
    let dateToExclusive = dayjs(date).valueOf();
    this.subscription = this.statsService.getResFunMonth(dateToExclusive).subscribe(
        res => {
          this.councilStatsResponseDTOs = res;
          this.resultCouncilStatsResponseDTO.projectsReceived =
              this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.projectsReceived,0);
          this.resultCouncilStatsResponseDTO.projectsOverdue =
              this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.projectsOverdue,0);
          this.resultCouncilStatsResponseDTO.finishedProjects =
              this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.finishedProjects,0);
          this.resultCouncilStatsResponseDTO.projectsNotFinished =
              this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.projectsNotFinished,0);
          this.resultCouncilStatsResponseDTO.overdueDaysProject =
              this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.overdueDaysProject,0);
        },
        err => {
          this.showStatus500(err);
        }
    );
  }

  private getResFunYear() {
    let date = new Date(this.year, 0, 1);

    let dateFrom = dayjs(date).valueOf();
    let dateTo = dayjs(date).add(1, 'year').valueOf();
    this.subscription = this.statsService.getResFunYear(dateFrom, dateTo).subscribe(
        res => {
          this.councilStatsResponseDTOs = res;
          this.resultCouncilStatsResponseDTO.projectsReceived =
              this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.projectsReceived,0);
          this.resultCouncilStatsResponseDTO.projectsOverdue =
              this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.projectsOverdue,0);
          this.resultCouncilStatsResponseDTO.finishedProjects =
              this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.finishedProjects,0);
          this.resultCouncilStatsResponseDTO.projectsNotFinished =
              this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.projectsNotFinished,0);
          this.resultCouncilStatsResponseDTO.overdueDaysProject =
              this.councilStatsResponseDTOs.reduce((acc, obj) => acc+obj.overdueDaysProject,0);
        },
        err => {
          this.showStatus500(err);
        }
    );
  }

  private showStatus500(err: any){
    if(err.status == 500){
      this.councilStatsResponseDTOs.forEach(cs => {
        cs.projectsReceived = 0;
        cs.finishedProjects = 0;
        cs.projectsNotFinished = 0;
        cs.projectsOverdue = 0;
      })
      this.resultCouncilStatsResponseDTO.projectsReceived = 0;
      this.resultCouncilStatsResponseDTO.finishedProjects = 0;
      this.resultCouncilStatsResponseDTO.projectsNotFinished = 0;
      this.resultCouncilStatsResponseDTO.projectsOverdue = 0;
    }
  }
}
