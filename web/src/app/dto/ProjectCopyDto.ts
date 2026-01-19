import {HasState} from "@app/dto/HasState";

export class ProjectCopyDto extends HasState {
  title: string;
  documents: number[] = [];

}