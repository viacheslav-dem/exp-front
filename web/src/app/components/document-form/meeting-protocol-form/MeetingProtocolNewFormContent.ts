import {FormContent} from "@app/components/document-form/form-model/FormContent";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {AgendaNewFormContent} from "@app/components/document-form/meeting-protocol-form/AgendaNewFormContent";

export class MeetingProtocolNewFormContent extends FormContent {
  chairman: PersonPlainDto;
  endDate: number;
  participants: PersonPlainDto[] = [];
  invited: string[] = [];
  projectsById: { [key: number]: AgendaNewFormContent } = {};
  prepareTimeByChairman: number;
  prepareTimeBySecretary: number;
}
