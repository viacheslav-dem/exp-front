import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {IdDto} from "@app/dto/IdDto";

export class AuditRecordDto extends IdDto {
  date: Date;
  person: PersonPlainDto;
  type: string;
  message:string;
}
