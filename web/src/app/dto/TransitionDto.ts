import {PersonPlainDto} from "@app/dto/PersonPlainDto";

export class TransitionDto {
  newState: string;
  person: PersonPlainDto;
  role: string;
  date: number;
}
