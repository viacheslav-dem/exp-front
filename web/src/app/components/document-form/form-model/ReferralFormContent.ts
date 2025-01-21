import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {FormContent} from "@app/components/document-form/form-model/FormContent";

export class ReferralFormContent extends FormContent {

  gkntDepartmentChairman: PersonPlainDto;

  customerRequestDate: number;
  customerRequestNum: string;
  customerRequestQuestions: string;

  basedOnBadCodeProject: boolean;
  badCodeProject: number;
}
