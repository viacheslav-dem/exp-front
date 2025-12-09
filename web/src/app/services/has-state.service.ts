import {isAfter, addDays, format, getTime} from 'date-fns';
import {ru} from 'date-fns/locale';
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
    let current = new Date();
    let viewState: ViewState = entity.viewState;
    if (viewState == null) {
      viewState = new ViewState(entity);
    }
    if (viewState.stateEndDate && isAfter(current, addDays(new Date(viewState.stateEndDate), 1))) {
      entity.red = true;
    } else if (viewState.stateEndDate && isAfter(current, new Date(viewState.stateEndDate))) {
      entity.yellow = true;
    } else if (viewState.stateMiddleDate && isAfter(current, new Date(viewState.stateMiddleDate))) {
      entity.blue = true;
    }
    if (viewState.stateEndDate && termsMessages[viewState.state]) {
      entity.termsMessage = termsMessages[viewState.state] + ' по ' + format(new Date(viewState.stateEndDate), "dd.MM.yyyy", {locale: ru});
    }
  }
}
