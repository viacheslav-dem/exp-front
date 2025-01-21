import {Pipe} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({name: 'lifecycleState'})
export class LifecycleStatePipe extends AbstractEnumPipe<ProjectLifecycleState> {

  init() {
    this.map[ProjectLifecycleState.READY] = 'Готов к отправке';
    this.map[ProjectLifecycleState.ON_EXPERT_EXAMINATION] = 'На экспертной оценке';
    this.map[ProjectLifecycleState.READY_FOR_MEETING] = 'Готов к рассмотрению';
    this.map[ProjectLifecycleState.ON_CHOOSING_MEETING] = 'Назначение даты заседания';
    this.map[ProjectLifecycleState.ON_WAITING_RESPONSE] = 'Ожидание ответов на замечания';
    this.map[ProjectLifecycleState.ON_DISCUSSION] = 'На обсуждении';
    this.map[ProjectLifecycleState.ACCEPTED] = 'Рекомендован';
    this.map[ProjectLifecycleState.REJECTED] = 'Не рекомендован';
    this.map[ProjectLifecycleState.RETURNED] = 'Возвращён';
    this.map[ProjectLifecycleState.RETURNED_WITHOUT_EXPERTISE] = 'Возвращён';
  }
}

export enum ProjectLifecycleState {
  READY = 'READY', // назначена секция
  ON_EXPERT_EXAMINATION = 'ON_EXPERT_EXAMINATION', // ожидание результатов экспертизы от экспертов
  READY_FOR_MEETING = 'READY_FOR_MEETING', // ожидание результатов экспертизы от экспертов
  ON_CHOOSING_MEETING = 'ON_CHOOSING_MEETING', // назначение даты заседания секции
  ON_WAITING_RESPONSE = 'ON_WAITING_RESPONSE', // ожидание ответов на замечания секции
  ON_DISCUSSION = 'ON_DISCUSSION', // проект ожидает рассмотрения на заседании секции
  ACCEPTED = 'ACCEPTED', // готовы результаты рассмотрения проекта секцией: проект рекомендован
  REJECTED = 'REJECTED', // готовы результаты рассмотрения проекта секцией: проект не рекомендован
  RETURNED = 'RETURNED', // проект возвращён без рассмотрения на заседании секции
  RETURNED_WITHOUT_EXPERTISE = 'RETURNED_WITHOUT_EXPERTISE', // проект возвращён без рассмотрения и без результатов экспертизы
}

export enum ProjectLifecycleStateBadge {
  READY = 'badge-info', // назначена секция
  ON_EXPERT_EXAMINATION = 'badge-info', // ожидание результатов экспертизы от экспертов
  READY_FOR_MEETING = 'badge-info', // ожидание результатов экспертизы от экспертов
  ON_CHOOSING_MEETING = 'badge-info', // назначение даты заседания секции
  ON_WAITING_RESPONSE = 'badge-info', // ожидание ответов на замечания секции
  ON_DISCUSSION = 'badge-info', // проект ожидает рассмотрения на заседании секции
  ACCEPTED = 'badge-success', // готовы результаты рассмотрения проекта секцией: проект рекомендован
  REJECTED = 'badge-danger', // готовы результаты рассмотрения проекта секцией: проект не рекомендован
  RETURNED = 'badge-danger', // проект возвращён без рассмотрения на заседании секции
  RETURNED_WITHOUT_EXPERTISE = 'badge-secondary', // проект возвращён без рассмотрения и без результатов экспертизы
}
