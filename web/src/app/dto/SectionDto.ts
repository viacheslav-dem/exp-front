import {IdNameDto} from "@app/dto/IdNameDto";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {IdDto} from "@app/dto/IdDto";
import {SectionType} from "@app/pipes/section-type.pipe";

export class SectionDto extends IdNameDto {
  disabled: boolean;
  council: IdDto;
  sectionType: SectionType;
  head: PersonPlainDto;
  deputyHead: PersonPlainDto;
  secretary: PersonPlainDto;
  assessors: PersonPlainDto[] = [];
  // ui calculated fields
  isExpanded: boolean;
  isEdit: boolean;

  constructor(councilId?: number) {
    super();
    this.council = new IdDto(councilId);
    this.name = ''; // for correct sorting
  }
}
