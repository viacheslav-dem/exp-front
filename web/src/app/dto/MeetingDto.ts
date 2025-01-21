import {PeriodDto} from "@app/dto/PeriodDto";
import {IdDto} from "@app/dto/IdDto";
import {DocumentDto} from "@app/dto/DocumentDto";
import {AgendaDto} from "@app/dto/AgendaDto";

export class MeetingDto extends IdDto {
  agendas: AgendaDto[];
  period: PeriodDto;
  report: DocumentDto;
  paymentDocument: DocumentDto;
  state: string;
  description: string;
  place: string;
  routerLink: any[];
  cancelReason: string;
  section: IdDto;
  bureau: IdDto;
}
