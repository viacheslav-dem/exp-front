import * as moment from "moment";
import {Moment} from "moment";
import {HasState, ViewState} from "@app/dto/HasState";
import {Role} from "@app/pipes/role.pipe";
import {AuthService} from "@app/services/auth.service";

export class HasStateService {

  constructor(protected _authService: AuthService) {
  }

  prepare(entity: HasState, termsMessages: any) {
    if (this._authService.getCurrRole() == Role.CUSTOMER) {
      return;
    }
    let current: Moment = moment();
    let viewState: ViewState = entity.viewState;
    if (viewState == null) {
      viewState = new ViewState(entity);
    }
    if (viewState.stateEndDate && current.isAfter(moment(viewState.stateEndDate).add(1, "days"))) {
      entity.red = true;
    } else if (viewState.stateEndDate && current.isAfter(moment(viewState.stateEndDate))) {
      entity.yellow = true;
    } else if (viewState.stateMiddleDate && current.isAfter(moment(viewState.stateMiddleDate))) {
      entity.blue = true;
    }
    if (viewState.stateEndDate && termsMessages[viewState.state]) {
      entity.termsMessage = termsMessages[viewState.state] + ' по ' + moment(viewState.stateEndDate).format("DD.MM.YYYY");
    }
  }
}
