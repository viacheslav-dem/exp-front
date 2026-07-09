import {Injectable} from "@angular/core";
import {SERVER_URL} from "@app/config";
import {HttpClientSecure} from "@app/services/http.client";
import {Observable} from "rxjs";
import {SystemNotificationDto} from "@app/dto/SystemNotificationDto";

@Injectable()
export class SystemNotificationService {

    url: string = `${SERVER_URL}/system-notification`;
    notification: SystemNotificationService;

    constructor(private _http: HttpClientSecure) {
    }

    getNotification(notification: SystemNotificationDto): Observable<SystemNotificationDto> {
        return this._http.post(`${this.url}/get`, notification);
    }

    saveNotification(notification: SystemNotificationDto): Observable<SystemNotificationDto> {
        return this._http.post(`${this.url}`, notification);
    }
}