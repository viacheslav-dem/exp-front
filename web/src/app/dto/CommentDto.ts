import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {IdDto} from "@app/dto/IdDto";

export class CommentDto extends IdDto {
  createdDate: Date;
  text: string;
  agenda: IdDto;
  person: PersonPlainDto;

  constructor(agenda: IdDto, text: string) {
    super();
    this.agenda = agenda;
    this.text = text;
  }
}
