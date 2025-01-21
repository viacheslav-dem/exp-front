import {Pipe} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({name: 'fundingType'})
export class FundingTypePipe extends AbstractEnumPipe<FundingType> {

  init() {
    this.map[FundingType.BUDGETARY] = 'Бюджетное';
    this.map[FundingType.EXTRABUDGETARY] = 'Внебюджетное';
  }

}

export enum FundingType {
  BUDGETARY = 'BUDGETARY',
  EXTRABUDGETARY = 'EXTRABUDGETARY'
}

export function getAllFundingType() {
  return Object.keys(FundingType);
}

