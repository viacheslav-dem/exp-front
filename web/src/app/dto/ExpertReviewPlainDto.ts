import {IdDto} from "@app/dto/IdDto";

export class ExpertReviewPlainDto extends IdDto {
  state: string;
  rejectionReason: string;
}
