import {DocumentDto} from "@app/dto/DocumentDto";
import {HasState} from "@app/dto/HasState";

export class ProjectCopyDto extends HasState {
  title: string;
  documents: DocumentDto[] = [];

}