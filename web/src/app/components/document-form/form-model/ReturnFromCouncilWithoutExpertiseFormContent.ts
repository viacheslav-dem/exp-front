import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {FormContent} from "@app/components/document-form/form-model/FormContent";
import {CouncilPlainDto} from "@app/dto/CouncilPlainDto";

export class ReturnFromCouncilWithoutExpertiseFormContent extends FormContent {
  chairman: PersonPlainDto;
  rejectionReason: string;
  targetCouncil: CouncilPlainDto;
}
