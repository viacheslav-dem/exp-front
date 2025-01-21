import {Injectable} from '@angular/core';
import {HttpClientSecure} from "./http.client";
import {SERVER_URL} from "../config";
import {IdDto} from "@app/dto/IdDto";
import {ProjectLifecycleDto} from "@app/dto/ProjectLifecycleDto";
import {ProjectDto} from "@app/dto/ProjectDto";
import {Observable} from "rxjs";

@Injectable()
export class LifecycleService {

  public url = SERVER_URL + '/lifecycle';

  constructor(private _http: HttpClientSecure) {
  }

  deleteLifecycle(idDto: IdDto) {
    return this._http.deleteBlock(`${this.url}/delete/${idDto.id}`);
  }

  finishExpertExamination(idDto: IdDto) {
    return this._http.postBlock(`${this.url}/send/${idDto.id}/ready-for-meeting`, null);
  }

  returnFromSectionToCouncil(idDto: IdDto, reason: string) {
    return this._http.postBlock(`${this.url}/return-section-to-council/${idDto.id}`, {value: reason});
  }

  saveAnswerForSectionRemarks(lifecycle: ProjectLifecycleDto) {
    return this._http.postBlock(`${this.url}/save-answer-for-remark`, lifecycle)
  }

  replyForSectionRemark(lifecycle: ProjectLifecycleDto): Observable<ProjectDto> {
    return this._http.postBlock(`${this.url}/reply-for-remark`, lifecycle)
  }

  returnFromSectionToCouncilWithoutExamination(idDto: IdDto){
    return this._http.postBlock(`${this.url}/return-section-to-council-without-exp/${idDto.id}`, null);
  }
}
