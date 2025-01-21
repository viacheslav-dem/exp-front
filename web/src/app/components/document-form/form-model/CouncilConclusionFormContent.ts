import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {AgendaNewFormContent} from "@app/components/document-form/meeting-protocol-form/AgendaNewFormContent";
import {FormContent} from "@app/components/document-form/form-model/FormContent";

export class CouncilConclusionFormContent extends FormContent {

  chairman: PersonPlainDto;
  innerExpertiseDate: number;
  documents: string[] = [];
  projectProtocol: AgendaNewFormContent = new AgendaNewFormContent();
}
