import {DocumentDto} from "./DocumentDto";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {HasState} from "@app/dto/HasState";

export class AccountingDto extends HasState {
  stateStartDate: number;
  person: PersonPlainDto;
  actuallyPaid: number;
  paySum: number;
  socialInsurance: number;
  pensionInsurance: number;
  accountingType: string;
  contractDate: number;
  actDate: number;
  act: DocumentDto;
  contract: DocumentDto;
  description: string;
  payDate: Date;
}
