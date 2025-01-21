import {IdDto} from "@app/dto/IdDto";
import {PersonNameDto} from "@app/dto/PersonNameDto";

export class PersonPlainDto extends IdDto {
  personName: PersonNameDto;
  isChecked: boolean;
}
