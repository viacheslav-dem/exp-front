import {FormContent} from "@app/components/document-form/form-model/FormContent";
import {IdNameDto} from "@app/dto/IdNameDto";
import {Text} from "@app/components/document-form/form-model/Text";

export class ExpertReviewFormContent extends FormContent {
  hours: number;

  program: string;
  study: string;
  selectedDirections: IdNameDto[] = [];
  selectedSocialEconomicGoals: IdNameDto[] = [];
  directionsAndGoalsText: string;
  privacyObjectsDescription: string;
  privacyObjectsDescriptionText: string;
  conclusion: boolean;
  conclusionText: string;
  wrappedNotes: Text[] = [];

  /* for old forms */
  privacyObjects: string[] = [];
  stages: string[] = [];
  notes: string[] = [];
}
