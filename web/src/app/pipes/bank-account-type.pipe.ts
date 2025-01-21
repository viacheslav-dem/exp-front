import {Pipe, PipeTransform} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({name: 'bankAccountType'})
export class BankAccountTypePipe extends AbstractEnumPipe<BankAccountType> {

  init() {
    this.map[BankAccountType.ACCOUNT] = 'Расчётный счёт (IBAN)';
    this.map["CARD"] = 'Номер карточки';
  }
}

export enum BankAccountType {
  ACCOUNT = 'ACCOUNT',
}

export function getAllBankAccountTypes() {
  return Object.keys(BankAccountType);
}
