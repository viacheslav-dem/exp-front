import {Injectable} from "@angular/core";
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError} from "rxjs/operators";
import {SERVER_URL} from "@app/config";

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {

    ignoredURLs: Array<string> = [`${SERVER_URL}/system-notification/get`];
    ignoredHeaders = [];

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    let isIgnoredUrl = false;
                    this.ignoredURLs.forEach(ignoredURL=> {
                        if (err.url.includes(ignoredURL)) {
                            isIgnoredUrl = true;
                        }
                    });
                    if (isIgnoredUrl) return of(false);

                    throw err;
                })
            );
    }
}
