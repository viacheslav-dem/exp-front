import {Pipe} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({name: 'decision'})
export class DecisionPipe extends AbstractEnumPipe<DecisionState> {

  init() {
    this.map[DecisionState.ACCEPTED] = 'Принят';
    this.map[DecisionState.REJECTED] = 'Отклонён';
    this.map[DecisionState.RESCHEDULED] = 'Перенесён'
  }
}

export enum DecisionState {
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  RESCHEDULED = 'RESCHEDULED'
}

export enum DecisionStateBadge {
  REJECTED = 'badge-danger',
  ACCEPTED = 'badge-success',
  RESCHEDULED = 'badge-info'
}

export function getAllDecisionStates() {
  return Object.keys(DecisionState).sort();
}
