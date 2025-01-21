import {Injectable} from "@angular/core";
import {SERVER_URL} from "@app/config";
import {HttpClientSecure} from "@app/services/http.client";
import {Observable} from "rxjs";
import {ProjectTransitionHistoryDto} from "@app/dto/ProjectTransitionHistoryDto";
import {LifecycleGroupTransitionHistoryDto} from "@app/dto/LifecycleGroupTransitionHistoryDto";
import {ProjectLifecycleTransitionHistoryDto} from "@app/dto/ProjectLifecycleTransitionHistoryDto";
import {ExpertTransitionHistoryDto} from "@app/dto/ExpertTransitionHistoryDto";
import {IdDto} from "@app/dto/IdDto";

@Injectable()
export class TransitionHistoryService {

  public url = SERVER_URL + '/transition-history';

  constructor(private _http: HttpClientSecure) {
  }

  getProjectHistory(project: IdDto): Observable<ProjectTransitionHistoryDto> {
    return this._http.getBlock(`${this.url}/project/${project.id}`);
  }

  getGroupHistory(group: IdDto): Observable<LifecycleGroupTransitionHistoryDto> {
    return this._http.getBlock(`${this.url}/group/${group.id}`);
  }

  getLifecycleHistory(lifecycle: IdDto): Observable<ProjectLifecycleTransitionHistoryDto> {
    return this._http.getBlock(`${this.url}/lifecycle/${lifecycle.id}`);
  }

  getExpertHistory(review: IdDto): Observable<ExpertTransitionHistoryDto> {
    return this._http.getBlock(`${this.url}/expert/${review.id}`);
  }
}
