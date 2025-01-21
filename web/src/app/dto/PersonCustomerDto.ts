import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {IdNameDto} from "@app/dto/IdNameDto";

export class PersonCustomerDto extends PersonPlainDto {
  org: IdNameDto;
}
