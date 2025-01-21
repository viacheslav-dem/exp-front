import {IdNameDto} from "@app/dto/IdNameDto";
import {SectionType} from "@app/pipes/section-type.pipe";
import {CouncilPlainDto} from "@app/dto/CouncilPlainDto";

export class SectionPlainDto extends IdNameDto {
  sectionType: SectionType;
  council: CouncilPlainDto;
}
