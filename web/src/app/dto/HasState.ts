import {IdDto} from "@app/dto/IdDto";

export class HasState extends IdDto {
  stateMiddleDate: number;
  stateEndDate: number;
  state: string;
  viewState: ViewState;
  // ui calculated fields
  red: boolean;
  yellow: boolean;
  blue: boolean;
  termsMessage: string;
  badge: string = 'badge-info';
  expectedBadge: string = 'badge-info';
}

export class ViewState {
  stateMiddleDate: number;
  stateEndDate: number;
  state: string;
  constructor(entity:HasState){
    this.stateEndDate = entity.stateEndDate;
    this.stateMiddleDate = entity.stateMiddleDate;
    this.state = entity.state;
  }
}