import {Injectable} from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import {finalize, tap} from "rxjs/operators";
import {DEBUG} from "@app/config";

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const started = Date.now();
    let ok: string;
    let data: any;

    // extend server response observable with logging
    return next.handle(req)
      .pipe(
        tap(
          event => {
            if (event instanceof HttpResponse) {
              ok = 'succeeded';
              data = event.body;
            }
          },
          error => ok = 'failed'
        ),
        finalize(() => {
          if (!DEBUG) return;
          const elapsed = Date.now() - started;
          const msg = `${req.method} "${req.urlWithParams}"
             ${ok} in ${elapsed} ms.\nResponse:${data != null ? JSON.stringify(data) : 'null'}`;
          console.log(msg);
        })
      );
  }
}
