import {ErrorHandler, Injectable} from "@angular/core";
import {GlobalToastyService} from "@app/services/global-toasty.service";

@Injectable()
export class CustomErrorHandler extends ErrorHandler {

  constructor(private _toasty: GlobalToastyService) {
    super();
  }

  handleError(error: Error) {
    if (error.name != 'HttpErrorResponse') {
      this._toasty.error(error.message || error);
    }
    super.handleError(error);
  }
}
