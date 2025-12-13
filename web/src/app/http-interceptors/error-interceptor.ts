import {Injectable} from "@angular/core";
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError} from "rxjs/operators";
import {SERVER_URL} from "@app/config";

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {

    ignoredURLs: Array<string> = [
        `${SERVER_URL}/system-notification/get`,
        `${SERVER_URL}/get/meth_rec/`
    ];
    ignoredHeaders = [];

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    let isIgnoredUrl = false;
                    // Проверяем как URL запроса, так и URL ошибки
                    const urlToCheck = err.url || request.url;
                    this.ignoredURLs.forEach(ignoredURL=> {
                        if (urlToCheck.includes(ignoredURL)) {
                            isIgnoredUrl = true;
                        }
                    });
                    // Для игнорируемых URL при 404 возвращаем пустой результат вместо ошибки
                    if (isIgnoredUrl && err.status === 404) {
                        return of(null);
                    }
                    if (isIgnoredUrl) return of(false);

                    throw err;
                })
            );
    }
}
