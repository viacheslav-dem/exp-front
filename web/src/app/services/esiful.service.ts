import {Injectable, OnInit} from "@angular/core";
import {HttpClientSecure} from "@app/services/http.client";
import {Observable} from "rxjs";
import {ProtectedAuthorizationParameters} from "@app/dto/ProtectedAuthorizationParameters";
import {SERVER_URL} from "@app/config";
import {DataIseful} from "@app/dto/DataIseful";
import {UserEsiful} from "@app/dto/UserEsiful";
import {HttpResponse} from "@angular/common/http";
import {ProjectDto} from "@app/dto/ProjectDto";
import {DocumentDto} from "@app/dto/DocumentDto";
import {VerifiedDocumentDto} from "@app/dto/VerifiedDocumentDto";

@Injectable()
export class EsifulService implements OnInit {

    private apiUrl = 'http://127.0.0.1:8084';

    constructor(private http: HttpClientSecure) {
    }

    ngOnInit(): void {
    }


    inputISEFUL(): Observable<ProtectedAuthorizationParameters> {
        return this.http.getBlock(`${SERVER_URL}/esiful/log-in`);
    }

    inputCP(signed_data_to_check_in_cp: string): Observable<String> {
        return this.http.postBlock(`${this.apiUrl}/select_auth`, {data: signed_data_to_check_in_cp});
    }

    dataParams(data: DataIseful): Observable<UserEsiful>{
        console.log("login-callback");
        return this.http.postBlock(`${SERVER_URL}/esiful/login-callback`, data
        );
    }

    logoutUserEsiful() {
        return this.http.get(`${SERVER_URL}/esiful/logout`);
    }
    getCurrentUserEsiful(): Observable<UserEsiful>   {
        return this.http.get<UserEsiful>(`${SERVER_URL}/esiful/current-user-esful`);
    }

    sendForSignatureGkntDepartmentChairmanInEsiful(project: ProjectDto): Observable<ProjectDto>  {
        return this.http.postBlock(`${SERVER_URL}/esiful/send/${project.id}/on-signing`, null);
    }

    checkSignature(doc: DocumentDto): Observable<VerifiedDocumentDto> {
        return this.http.postBlock(`${SERVER_URL}/esiful/check/${doc.id}/signature`, null);
    }

    sendForSignatureGkntChairmanInEsiful(idDto: ProjectDto): Observable<ProjectDto> {
        return this.http.postBlock(`${SERVER_URL}/esiful/send/${idDto.id}/on-expert-examination`, null);
    }

    sendForSignatureCustomerInEsiful(idDto: ProjectDto): Observable<ProjectDto> {
        return this.http.postBlock(`${SERVER_URL}/esiful/send/${idDto.id}/new`, null);
    }
}
