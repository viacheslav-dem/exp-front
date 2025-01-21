import {Injectable} from "@angular/core";
import {HttpClientSecure} from "./http.client";
import {SERVER_URL} from "../config";
import {SearchPageRequest} from "@app/components/common-components/page-and-filter/model/SearchPageRequest";
import {Page} from "@app/components/common-components/page-and-filter/model/Page";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {Observable} from "rxjs";
import {AboutProjectDto} from "@app/dto/AboutProjectDto";

@Injectable()
export class AuditService {

  url: string = `${SERVER_URL}/audit`;

  constructor(private _http: HttpClientSecure) {
  }

  getAuditRecords(req: SearchPageRequest) {
      return this._http.post<Page<any>>(`${this.url}/get`, req);
  }

  getSessions():Observable<PersonPlainDto[]>{
      return this._http.get<PersonPlainDto[]>(`${this.url}/sessions`);
  }

  getProjectVersion():Observable<AboutProjectDto>{
      return this._http.get<AboutProjectDto>(`${SERVER_URL}/version`);
  }
}
