import {IdDto} from "@app/dto/IdDto";
import {PersonExpertDto} from "@app/dto/PersonExpertDto";

export class ExpertReviewAndExpertDto extends IdDto {
  expert: PersonExpertDto;
  state: string;
  rejectionReason: string;
  stateStartDate: Date;
}
