import {PeriodDto} from "@app/dto/PeriodDto";
import {ExpertReviewFormContent} from "@app/components/document-form/form-model/ExpertReviewFormContent";

export class ExpertReview_8_3_4_12NIOKTR_NewFormContent extends ExpertReviewFormContent {

  novelty: string;
  noveltyText: string;

  economicSignificance: string;
  economicSignificanceText: string;

  target: string;
  targetText: string;

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

  financeAccordance: boolean;
  financeAccordanceText: string;
  financeSuggestion: number;

  targetAccordance: boolean;
  targetAccordanceText: string;
  targetSuggestion: string;

  financeConclusion: boolean;
  financeConclusionText: string;
}
