import {Pipe, PipeTransform} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({
    name: 'projectState',
    standalone: false
})
export class ProjectStatePipe extends AbstractEnumPipe<ProjectState> {

  init() {
    this.map[ProjectState.ROUGH] = 'Черновик';
    this.map[ProjectState.FOR_APPROVAL] = 'На утверждении';
    this.map[ProjectState.NEW] = 'Новый';
    //this.map[ProjectState.ON_CHECKING] = 'В отделе БелИса';
     this.map[ProjectState.ON_CHECKING] = 'В подразделении ГКНТ';
    //this.map[ProjectState.ON_DEPARTMENT_SIGNING] = 'На подписи в отделе БелИса';
     this.map[ProjectState.ON_DEPARTMENT_SIGNING] = 'На подписи в подразделении ГКНТ';
    this.map[ProjectState.ON_SIGNING] = 'На визировании';
    this.map[ProjectState.ON_EXPERT_EXAMINATION] = 'На экспертной оценке';
    this.map[ProjectState.ON_EXAMINATION] = 'На экспертизе';
    this.map[ProjectState.ON_DEPARTMENT_FINAL_SIGNING] = 'На подписи в отделе БелИса';
    // this.map[ProjectState.ON_DEPARTMENT_FINAL_SIGNING] = 'На подписи в подразделении ГКНТ';
    this.map[ProjectState.ON_FINAL_SIGNING] = 'На визировании';
    this.map[ProjectState.ACCEPTED] = 'Рассмотрен';
    this.map[ProjectState.REJECTED] = 'Рассмотрен';
    this.map[ProjectState.RETURNED] = 'Возвращён';
  }
}

export enum ProjectState {
  ROUGH = 'ROUGH',//черновик
  FOR_APPROVAL = 'FOR_APPROVAL', //проект на утверждении головной организацией
  NEW = 'NEW',//новый проект не расписанный по ГКНТ
  ON_CHECKING = 'ON_CHECKING',//первичная проверка в ГКНТ
  ON_DEPARTMENT_SIGNING = 'ON_DEPARTMENT_SIGNING',//подпись начальника структ. подр.
  ON_SIGNING = 'ON_SIGNING',//подпись зам. пред.
  ON_EXPERT_EXAMINATION = 'ON_EXPERT_EXAMINATION',//формирование экспертных заключений
  ON_EXAMINATION = 'ON_EXAMINATION',//на экспертизе
  ON_DEPARTMENT_FINAL_SIGNING = 'ON_DEPARTMENT_FINAL_SIGNING', //подпись начальника структ. подр. по результатам экспертизы
  ON_FINAL_SIGNING = 'ON_FINAL_SIGNING', //подпись зам. пред. по результатам экспертизы
  ACCEPTED = 'ACCEPTED',//принят
  REJECTED = 'REJECTED',//отклонен
  RETURNED = 'RETURNED',//возврат без рассмотрения
}

export function getAllProjectStates() {
  return Object.keys(ProjectState);
}

export enum ProjectStateBadge {
  ROUGH = 'badge-info',//черновик
  NEW = 'badge-info',//новый проект не расписанный по ГКНТ
  FOR_APPROVAL = 'badge-info', //проект на утверждении головной организацией
  ON_CHECKING = 'badge-info',//первичная проверка в ГКНТ
  ON_DEPARTMENT_SIGNING = 'badge-info',//подпись начальника структ. подр.
  ON_SIGNING = 'badge-info',//подпись зам. пред.
  ON_EXPERT_EXAMINATION = 'badge-info',//формирование экспертных заключений
  ON_EXAMINATION = 'badge-info',//на экспертизе
  ON_DEPARTMENT_FINAL_SIGNING = 'badge-info', //подпись начальника структ. подр. по результатам экспертизы
  ON_FINAL_SIGNING = 'badge-info', //подпись зам. пред. по результатам экспертизы
  ACCEPTED = 'badge-success',//принят
  REJECTED = 'badge-danger',//отклонен
  RETURNED = 'badge-danger',//возврат без рассмотрения
}

export enum ProjectTermsMessages {
  NEW = 'Передать на экспертизу в ГЭС',
  ON_CHECKING = 'Передать на экспертизу в ГЭС',
  ON_DEPARTMENT_SIGNING = 'Передать на экспертизу в ГЭС',
  ON_SIGNING = 'Передать на экспертизу в ГЭС',
  ON_EXPERT_EXAMINATION = 'Завершить экспертизу',
  ON_EXAMINATION = 'Завершить экспертизу',
  ON_DEPARTMENT_FINAL_SIGNING = 'Вернуть результаты экспертизы',
  ON_FINAL_SIGNING = 'Вернуть результаты экспертизы',
}
