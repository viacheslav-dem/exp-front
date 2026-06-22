import {Pipe} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({
    name: 'role',
    standalone: false
})
export class RolePipe extends AbstractEnumPipe<Role> {

  init() {
    this.map[Role.EXPERT] = 'Эксперт';
    this.map[Role.CUSTOMER] = 'Заказчик экспертизы';
    this.map[Role.SUB_CUSTOMER] = 'Инициатор экспертизы';
    this.map[Role.SECTION_ASSESSOR] = 'Член секции' ;
    this.map[Role.BUREAU_ASSESSOR] = 'Член бюро';
    this.map[Role.SECTION_CHAIRMAN] = 'Аппарат секции ГЭС';
    this.map[Role.BUREAU_CHAIRMAN] = 'Аппарат бюро ГЭС';
    // this.map[Role.GKNT_CHAIRMAN] = 'Зам. Председателя ГКНТ';
    // this.map[Role.GKNT_DEPARTMENT_CHAIRMAN] = 'Начальник подразделения ГКНТ';
    // this.map[Role.GKNT_WORKER] = 'Ответственный сотрудник ГКНТ';
    this.map[Role.GKNT_CHAIRMAN] = 'Зам. Директора БелИСА';
    this.map[Role.GKNT_DEPARTMENT_CHAIRMAN] = 'Заведующий отделом БелИСА';
    this.map[Role.GKNT_WORKER] = 'Ответственный сотрудник БелИСА';

    this.map[Role.ADMIN] = 'Администратор';
    this.map[Role.BELISA_READ] = 'Сотрудник ГУ «БелИСА»';
    this.map[Role.BELISA_EDIT] = 'Сотрудник ГУ «БелИСА» (курирующий ГЭС)';
    // this.map[Role.BUHGALTER] = 'Сотрудник бухгалтерии ГКНТ';
    this.map[Role.BUHGALTER] = 'Сотрудник бухгалтерии БелИСА';
  }

  sortRoles(roles: string[]) {
    return roles.sort((r1, r2) => this.transform(r1).localeCompare(this.transform(r2)));
  }

  getAllRoles() {
    return this.sortRoles(Object.keys(Role));
  }

  getAllNotAutoActivatedRoles() {
    return this.sortRoles(Object.keys(AutoActivatedRole).filter(role => !AutoActivatedRole[role]));
  }
}

export enum Role {
  ADMIN = 'ADMIN',
  SECTION_ASSESSOR = 'SECTION_ASSESSOR',
  BUREAU_ASSESSOR = 'BUREAU_ASSESSOR',
  GKNT_CHAIRMAN = 'GKNT_CHAIRMAN',
  GKNT_DEPARTMENT_CHAIRMAN = 'GKNT_DEPARTMENT_CHAIRMAN',
  GKNT_WORKER = 'GKNT_WORKER',
  BUREAU_CHAIRMAN = 'BUREAU_CHAIRMAN',
  SECTION_CHAIRMAN = 'SECTION_CHAIRMAN',
  CUSTOMER = 'CUSTOMER',
  SUB_CUSTOMER = 'SUB_CUSTOMER',
  EXPERT = 'EXPERT',
  BELISA_READ = 'BELISA_READ',
  BELISA_EDIT = 'BELISA_EDIT',
  BUHGALTER = 'BUHGALTER'
}

export let AutoActivatedRole = {
  ADMIN: false,
  SECTION_ASSESSOR: true,
  BUREAU_ASSESSOR: true,
  GKNT_CHAIRMAN: true,
  GKNT_DEPARTMENT_CHAIRMAN: true,
  GKNT_WORKER: true,
  BUREAU_CHAIRMAN: true,
  SECTION_CHAIRMAN: true,
  CUSTOMER: false,
  SUB_CUSTOMER: false,
  EXPERT: false,
  BELISA_READ: false,
  BELISA_EDIT: true,
  BUHGALTER: false
};
