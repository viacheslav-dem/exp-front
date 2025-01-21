import {IdDto} from "@app/dto/IdDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {DocumentDto} from "@app/dto/DocumentDto";
import {CommentDto} from "@app/dto/CommentDto";

export class AgendaDto extends IdDto {
  project: ProjectPlainDto;
  decision: string;
  isCollapsed: boolean;
  comments: CommentDto[];
  remarks: DocumentDto;
  expertReviews: DocumentDto[];
  sectionProtocols: DocumentDto[];
  isAnswerReceived: boolean;
}
