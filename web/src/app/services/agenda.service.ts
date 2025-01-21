import {Injectable} from '@angular/core';
import {HttpClientSecure} from "./http.client";
import {SERVER_URL} from "../config";
import {IdDto} from "@app/dto/IdDto";
import {Observable} from "rxjs";
import {CommentDto} from "@app/dto/CommentDto";
import {DocumentDto} from "@app/dto/DocumentDto";

@Injectable()
export class AgendaService {

  public url = SERVER_URL + '/agenda';

  constructor(private _http: HttpClientSecure) {
  }

  getCommentsByAgenda(idDto: IdDto): Observable<CommentDto[]> {
    return this._http.get(`${this.url}/get/${idDto.id}/comments`);
  }

  createComment(idDto: IdDto, comment: CommentDto) {
    return this._http.postBlock(`${this.url}/create/${idDto.id}/comment`, comment);
  }

  getAgendaExpertReviews(idDto: IdDto): Observable<DocumentDto[]> {
    return this._http.getBlock(`${this.url}/get/${idDto.id}/expert-reviews`);
  }

  getAgendaAnonymousExpertReviews(idDto: IdDto): Observable<DocumentDto[]> {
    return this._http.getBlock(`${this.url}/get/${idDto.id}/anonymous-expert-reviews`);
  }

  getSectionReportsByBureauAssessor(idDto: IdDto): Observable<DocumentDto[]> {
    return this._http.get(`${this.url}/get/${idDto.id}/assessor/section-reports`);
  }
}
