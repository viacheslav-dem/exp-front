import {Pipe} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({name: 'lifecycleGroupState'})
export class LifecycleGroupStatePipe extends AbstractEnumPipe<LifecycleGroupState> {

  init() {
    this.map[LifecycleGroupState.READY] = 'Готов к отправке';
    this.map[LifecycleGroupState.ON_CHECKING] = 'На выборе секций';
    this.map[LifecycleGroupState.IN_PROCESSING] = 'В секциях';
    this.map[LifecycleGroupState.ON_CHOOSING_MEETING] = 'Назначение даты заседания';
    this.map[LifecycleGroupState.ON_DISCUSSION] = 'На обсуждении';
    this.map[LifecycleGroupState.ON_WAITING_RESPONSE] = 'Ожидание ответов на замечания';
    this.map[LifecycleGroupState.ON_CONCLUSION] = 'Ждёт заключения';
    this.map[LifecycleGroupState.ACCEPTED] = 'Рекомендован';
    this.map[LifecycleGroupState.REJECTED] = 'Не рекомендован';
    this.map[LifecycleGroupState.RETURNED] = 'Возвращён';
    this.map[LifecycleGroupState.RETURNED_WITHOUT_EXPERTISE] = 'Возвращён';
  }
}

export enum LifecycleGroupState {
  READY = 'READY', // для проекта назначен ГЭС, но он пока в ГКНТ; выбираются секции
  ON_CHECKING = 'ON_CHECKING', // проект поступил в ГЭСы, выбираются эксперты (и секции?)
  IN_PROCESSING = 'IN_PROCESSING', // проект отправлен в секции
  ON_CHOOSING_MEETING = 'ON_CHOOSING_MEETING', // проект ожидает назначения даты заседания бюро
  ON_DISCUSSION = 'ON_DISCUSSION', // проект ожидает рассмотрения (и рассматривается) на заседании бюро
  ON_WAITING_RESPONSE = 'ON_WAITING_RESPONSE', //ожидание ответов на замечания от заказчика
  ON_CONCLUSION = 'ON_CONCLUSION', // готовится заключение бюро
  ACCEPTED = 'ACCEPTED', // готовы результаты экспертизы проекта ГЭСом: проект рекомендован
  REJECTED = 'REJECTED', // готовы результаты экспертизы проекта ГЭСом: проект не рекомендован
  RETURNED = 'RETURNED', // проект возвращён без дальнейшего рассмотрения, т.е. без рассмотрения на заседании бюро
  RETURNED_WITHOUT_EXPERTISE = 'RETURNED_WITHOUT_EXPERTISE', // проект возвращён без рассмотрения и без результатов экспертизы
}

export enum LifecycleGroupStateBadge {
  READY = 'badge-info', // для проекта назначен ГЭС, но он пока в ГКНТ; выбираются секции
  ON_CHECKING = 'badge-info', // проект поступил в ГЭСы, выбираются эксперты (и секции?)
  IN_PROCESSING = 'badge-info', // проект отправлен в секции
  ON_CHOOSING_MEETING = 'badge-info', // проект ожидает назначения даты заседания бюро
  ON_WAITING_RESPONSE = 'badge-info', //ожидание ответов на замечания от заказчика
  ON_DISCUSSION = 'badge-info', // проект ожидает рассмотрения (и рассматривается) на заседании бюро
  ON_CONCLUSION = 'badge-info', // готовится заключение бюро
  ACCEPTED = 'badge-success', // готовы результаты экспертизы проекта ГЭСом: проект рекомендован
  REJECTED = 'badge-danger', // готовы результаты экспертизы проекта ГЭСом: проект не рекомендован
  RETURNED = 'badge-danger', // проект возвращён без дальнейшего рассмотрения, т.е. без рассмотрения на заседании бюро
  RETURNED_WITHOUT_EXPERTISE = 'badge-secondary', // проект возвращён без рассмотрения и без результатов экспертизы
}

export enum LifecycleGroupTermsMessages {
  ON_CHECKING = 'Отправить в секции',
}
