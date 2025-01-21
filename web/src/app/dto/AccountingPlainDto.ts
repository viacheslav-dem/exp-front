import {IdDto} from "./IdDto";
import {DocumentDto} from "./DocumentDto";

export class AccountingPlainDto extends IdDto {
  act: DocumentDto;
  contract: DocumentDto;
}
