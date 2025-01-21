import {TransitionDto} from "@app/dto/TransitionDto";

export class TransitionHistoryDto {
  name: string;
  entityId: number;
  type: string;
  transitions: TransitionDto[];
}
