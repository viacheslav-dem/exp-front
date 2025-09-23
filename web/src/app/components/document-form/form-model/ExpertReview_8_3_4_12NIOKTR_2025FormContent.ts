import {PeriodDto} from "@app/dto/PeriodDto";
import {ExpertReviewFormContent} from "@app/components/document-form/form-model/ExpertReviewFormContent";

export class ExpertReview_8_3_4_12NIOKTR_2025FormContent extends ExpertReviewFormContent {

  priorityAreas: boolean;

  priorityAreasText: string;

  availabilityDoc: boolean;

  availabilityDocSuggestion: string;

  availabilityDocText: string;

  novelty: string;
  noveltyText: string;

  scientificResearch: string;
  scientificResearchText: string

  economicSignificance: string;
  economicSignificanceText: string;

  target: string;
  targetText: string;

  taskLists: string;
  taskListsText: string;

  technologicalOrder: string;
  technologicalOrderText: string;

  commerce: string;
  commerceText: string;

  resourcesSufficiency: string;
  resourcesSufficiencyText: string;

  competenceSufficiency: string;
  competenceSufficiencyText: string;

  marketingResearch: string;
  marketingResearchText: string;

  competitiveness: string;
  competitivenessText: string;

  analog: string;
  analogText: string;

  analogParams: string;
  analogParamsText: string;

  needs: string;
  needsText: string;

  risks: string;
  risksText: string;

  stagesExist: string;
  stagesExistText: string;

  nameAccordance: boolean;
  nameAccordanceText: string;
  nameSuggestion: string;

  termsAccordance: boolean;
  termsAccordanceText: string;
  termsSuggestion: PeriodDto = new PeriodDto();

  socialOrSecurity: boolean;
  socialOrSecurityText: string;

  financeAccordance: boolean;
  financeAccordanceText: string;
  financeSuggestion: number;

  targetAccordance: boolean;
  targetAccordanceText: string;
  targetSuggestion: string;

  financeConclusion: boolean;
  financeConclusionText: string;
}