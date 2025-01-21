import {Injectable} from '@angular/core';
import {HttpClientSecure} from "./http.client";
import {SERVER_URL} from "../config";
import {Observable} from "rxjs";
import {StatsDto} from "@app/dto/StatsDto";
import {RealTimeStatsDto} from "@app/dto/RealTimeStatsDto";
import {IdDto} from "@app/dto/IdDto";
import {CouncilStatsDto} from "@app/dto/CouncilStatsDto";
import {CouncilStatsResponseDTO} from "@app/dto/response/CouncilStatsResponseDTO";
import {HttpErrorResponse} from "@angular/common/http";
import {CouncilStatsV2ResponseDTO} from "@app/dto/response/CouncilStatsV2ResponseDTO";

@Injectable()
export class StatsService {

  public searchUrl = `${SERVER_URL}/stats`;

  constructor(private _http: HttpClientSecure) {
  }

  getRealTimeStats(): Observable<RealTimeStatsDto> {
    return this._http.getBlock(`${this.searchUrl}/real-time`);
  }

  getStatsByMonths(dateFrom: number, dateTo: number): Observable<StatsDto[]> {
    return this._http.getBlock(`${this.searchUrl}/months`, {params: {dateTo: dateTo, dateFrom: dateFrom}});
  }

  // getCouncilStats(councilId: IdDto, dateFrom: number, dateTo: number): Observable<CouncilStatsDto[]> {
  //   console.log(councilId.id)
  //   return this._http.getBlock(`${this.searchUrl}/council/${councilId.id}`, {params: {dateTo: dateTo, dateFrom: dateFrom}});
  // }

  getCouncilStats(councilId: IdDto, dateFrom: number, dateTo: number): Observable<CouncilStatsResponseDTO[]> {
    return this._http.getBlock(`${this.searchUrl}/council/${councilId.id}`, {params: {dateTo: dateTo, dateFrom: dateFrom}});
  }

  getCouncilStatsForBureauChairman(dateFrom: number, dateTo: number): Observable<CouncilStatsDto[]> {
    return this._http.getBlock(`${this.searchUrl}/council`, {params: {dateTo: dateTo, dateFrom: dateFrom}});
  }

  getStatsForCurrentMonth(): Observable<StatsDto> {
    return this._http.get(`${this.searchUrl}/current-month`);
  }

  updateCouncilStatsForLastYear(): Observable<any> {
    return this._http.get(`${this.searchUrl}/council/update-last-year`);
  }

  updateCouncilStatsForAllTime(): Observable<any> {
    return this._http.get(`${this.searchUrl}/council/update-all`);
  }

  getResFunMonth(date: number): Observable<Array<CouncilStatsResponseDTO>>{
    return this._http.get(`${this.searchUrl}/council/result-fun-month`, {params: {date: date}});
  }

  getResFunYear(dateFrom: number, dateTo: number): Observable<Array<CouncilStatsResponseDTO>> {
    return this._http.get(`${this.searchUrl}/council/result-fun-year`, {params: {dateFrom: dateFrom, dateTo: dateTo}});
  }

}
