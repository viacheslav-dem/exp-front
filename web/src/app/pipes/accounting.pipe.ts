import {Pipe} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({
    name: 'accountingType',
    standalone: false
})
export class AccountingTypePipe extends AbstractEnumPipe<AccountingType> {

  init() {
    this.map[AccountingType.COUNCIL_ASSESSOR] = 'Член ГЭС';
    this.map[AccountingType.EXPERT_REVIEW] = 'Эксперт';
  }
}

@Pipe({
    name: 'accountingState',
    standalone: false
})
export class AccountingStatePipe extends AbstractEnumPipe<AccountingState> {

  init() {
    this.map[AccountingState.ROUGH] = 'Черновик расчётов';
    this.map[AccountingState.CONTRACT_CREATED] = 'Заключён договор';
    this.map[AccountingState.PAYMENT_WAITING] = 'Ожидает оплаты';
    this.map[AccountingState.FINISHED] = 'Оплачено';
  }
}

export enum AccountingType {
  EXPERT_REVIEW = 'EXPERT_REVIEW',
  COUNCIL_ASSESSOR = 'COUNCIL_ASSESSOR',
}

export function getAllAccountingTypes() {
  return Object.keys(AccountingType);
}

export enum AccountingState {
  ROUGH = 'ROUGH',
  CONTRACT_CREATED = 'CONTRACT_CREATED',
  PAYMENT_WAITING = 'PAYMENT_WAITING',
  FINISHED = 'FINISHED',
}

export function getAllAccountingStates() {
  return Object.keys(AccountingState);
}

export enum AccountingTermsMessages {
  PAYMENT_WAITING = 'Оплатить',
}
