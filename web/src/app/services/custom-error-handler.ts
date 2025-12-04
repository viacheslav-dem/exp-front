import {ErrorHandler, Injectable} from "@angular/core";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable()
export class CustomErrorHandler extends ErrorHandler {

  constructor(private _toasty: GlobalToastyService) {
    super();
  }

  handleError(error: Error) {
    // HttpErrorResponse errors are already handled by HttpClientSecure.handleError
    // which shows toast messages, so we don't need to handle them here
    if (!(error instanceof HttpErrorResponse)) {
      this._toasty.error(error.message || error.toString());
    }
    super.handleError(error);
  }
}
