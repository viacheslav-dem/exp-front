import dayjs from 'dayjs';
import 'dayjs/locale/ru';
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
    if (viewState.stateEndDate && dayjs(current).isAfter(dayjs(viewState.stateEndDate).add(1, 'day'))) {
      entity.red = true;
    } else if (viewState.stateEndDate && dayjs(current).isAfter(dayjs(viewState.stateEndDate))) {
      entity.yellow = true;
    } else if (viewState.stateMiddleDate && dayjs(current).isAfter(dayjs(viewState.stateMiddleDate))) {
      entity.blue = true;
    }
    if (viewState.stateEndDate && termsMessages[viewState.state]) {
      entity.termsMessage = termsMessages[viewState.state] + ' по ' + dayjs(viewState.stateEndDate).locale('ru').format("DD.MM.YYYY");
    }
  }
}
