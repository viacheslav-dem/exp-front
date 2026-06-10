import {Injectable} from '@angular/core';
import {HttpClientSecure} from "./http.client";
import {SERVER_URL} from "../config";
import {Observable} from "rxjs";
import {StatsDto} from "@app/dto/StatsDto";
import {RealTimeStatsDto} from "@app/dto/RealTimeStatsDto";
import {IdDto} from "@app/dto/IdDto";
import {CouncilStatsDto} from "@app/dto/CouncilStatsDto";
import {CouncilStatsResponseDTO} from "@app/dto/response/CouncilStatsResponseDTO";
import { HttpErrorResponse } from "@angular/common/http";
import {CouncilStatsV2ResponseDTO} from "@app/dto/response/CouncilStatsV2ResponseDTO";
import {SearchPageRequest} from "@app/components/common-components/page-and-filter/model/SearchPageRequest";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";
import {SigningUserinfoDto} from "@app/dto/SigningUserinfoDto";

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
    return this._http.getBlock(`${this.searchUrl}/council/result-fun-month`, {params: {date: date}});
  }

  getResFunYear(dateFrom: number, dateTo: number): Observable<Array<CouncilStatsResponseDTO>> {
    return this._http.getBlock(`${this.searchUrl}/council/result-fun-year`, {params: {dateFrom: dateFrom, dateTo: dateTo}});
  }

  getCaseProduction(dateFrom: string | null, dateTo: string | null, lastName: string | null, orgName: string | null, pageRequest: PageRequest) {
    let params: any = {
      page: pageRequest.page - 1,
      size: pageRequest.size
    };

    if (dateFrom) {
      params.dateFrom = dateFrom;
    }
    if (dateTo) {
      params.dateTo = dateTo;
    }
    if (lastName) {
      params.lastName = lastName;
    }
    if (orgName) {
      params.orgName = orgName;
    }

    if (pageRequest.orders && pageRequest.orders.length > 0) {
      params.sort = pageRequest.orders.map(order => `${order.property},${order.direction}`).join(',');
    }

    return this._http.get(`${this.searchUrl}/case-production`, {params});
  }

  updateCaseProductionRecordKeeping(caseProdId: number, recordKeepingId: number | null): Observable<SigningUserinfoDto> {
    const body = {
      recordKeepingId: recordKeepingId
    };
    return this._http.put<SigningUserinfoDto>(`${this.searchUrl}/case-production/${caseProdId}/record-keeping`, body);
  }

}
