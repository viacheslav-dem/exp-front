import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClientSecure} from "./http.client";
import {SERVER_URL} from "../config";
import {Observable, Subject} from "rxjs";
import {PersonDto} from "@app/dto/PersonDto";
import {SearchPageRequest} from "@app/components/common-components/page-and-filter/model/SearchPageRequest";
import {Page} from "@app/components/common-components/page-and-filter/model/Page";
import {IdNameDto} from "@app/dto/IdNameDto";
import {PersonExpertDto} from "@app/dto/PersonExpertDto";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {StorageService} from "@app/services/storage.service";
import {IdDto} from "@app/dto/IdDto";

@Injectable()
export class PersonService {

    url: string = `${SERVER_URL}/persons`;
    onPersonListChanged: Subject<any> = new Subject();
    onCurrentPersonChanged: Subject<PersonDto> = new Subject();

    constructor(private _http: HttpClientSecure,
                private _storage: StorageService) {
    }

    searchPersons(req: SearchPageRequest): Observable<Page<PersonPlainDto>> {
        return this._http.post(`${this.url}/search`, req);
    }

    getPersons(req: SearchPageRequest): Observable<Page<PersonDto>> {
        return this._http.post(`${this.url}/get`, req);
    }

    searchExperts(req: SearchPageRequest): Observable<Page<PersonExpertDto>> {
        return this._http.post(`${this.url}/search/expert`, req);
    }

    saveOrUpdateCurrentPerson(person: PersonDto): Observable<PersonDto> {
        return this._http.post<PersonDto>(`${this.url}/save/current`, person).pipe(map(res => {
            this.onPersonListChanged.next(res);
            return res;
        }));
    }

    saveOrUpdatePerson(person: PersonDto): Observable<PersonDto> {
        return this._http.post<PersonDto>(`${this.url}/save`, person).pipe(map(res => {
            if (this._storage.getUserId() == res.id.toString()) {
                this.onCurrentPersonChanged.next(res);
            }
            return res;
        }));
    }

    deletePerson(personId: number): Observable<number> {
        return this._http.deleteBlock<number>(`${this.url}/${personId}`, null);
    }

    getPhoto(idDto: IdDto): Observable<IdNameDto> {
        return this._http.get<IdNameDto>(`${this.url}/${idDto.id}/photo`);
    }

    getCurrentPerson(): Observable<PersonDto> {
        return this._http.get<PersonDto>(`${this.url}/current-person`);
    }
}
