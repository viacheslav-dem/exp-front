import {IdNameDto} from "@app/dto/IdNameDto";
import {CouncilPlainDto} from "@app/dto/CouncilPlainDto";

export class BureauPlainDto extends IdNameDto {
  council: CouncilPlainDto;
}
