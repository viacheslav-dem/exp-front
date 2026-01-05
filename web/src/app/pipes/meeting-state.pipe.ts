import {Pipe} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({
    name: 'meetingState',
    standalone: false
})
export class MeetingStatePipe extends AbstractEnumPipe<MeetingState> {

  init() {
    this.map[MeetingState.FINISHED] = 'Завершено';
    this.map[MeetingState.READY] = 'На обсуждении';
    this.map[MeetingState.CANCELED] = 'Отменено';
  }
}

export enum MeetingState {
  READY = 'READY',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED',
}

export enum MeetingStateBadge {
  READY = 'badge-info',
  FINISHED = 'badge-success',
  CANCELED = 'badge-danger',
}

export function getAllMeetingStates() {
  return Object.keys(MeetingState);
}
