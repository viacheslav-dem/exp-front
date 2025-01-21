import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {IdDto} from "@app/dto/IdDto";

export class BureauDto extends IdDto {
  council: IdDto;
  chairman: PersonPlainDto;
  deputyChairman: PersonPlainDto;
  secretary: PersonPlainDto;
  assessors: PersonPlainDto[];

  // fields for ui
  isEdit: boolean;
  isExpanded: boolean;
}
