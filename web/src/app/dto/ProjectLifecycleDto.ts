import {IdDto} from "@app/dto/IdDto";
import {DocumentDto} from "@app/dto/DocumentDto";
import {RemarkDto} from "@app/dto/RemarkDto";
import {SectionPlainDto} from "@app/dto/SectionPlainDto";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";

export class ProjectLifecycleDto extends IdDto {
  state: string;
  section: SectionPlainDto;
  meetingProtocol: DocumentDto[] = [];
  rejectionReason: string;
  sectionHead: PersonPlainDto;
  remarks: RemarkDto[] = [];
  remarkDocuments: DocumentDto[] = [];
  isAnswerReceived: boolean;
}
