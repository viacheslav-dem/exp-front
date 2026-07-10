import {Injectable} from "@angular/core";
import {SERVER_URL} from "@app/config";
import {HttpClientSecure} from "@app/services/http.client";
import {Observable} from "rxjs";
import {MaintenanceWindowDto} from "@app/dto/MaintenanceWindowDto";

@Injectable()
export class MaintenanceWindowService {

    url: string = `${SERVER_URL}/maintenance-window`;

    constructor(private _http: HttpClientSecure) {
    }

    getMaintenanceWindow(): Observable<MaintenanceWindowDto> {
        return this._http.get(`${this.url}`);
    }

    saveMaintenanceWindow(window: MaintenanceWindowDto): Observable<MaintenanceWindowDto> {
        return this._http.post(`${this.url}`, window);
    }
}
