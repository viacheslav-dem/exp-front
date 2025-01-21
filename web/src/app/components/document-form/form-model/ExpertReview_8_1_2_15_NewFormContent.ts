import {PeriodDto} from "@app/dto/PeriodDto";
import {ExpertReviewFormContent} from "@app/components/document-form/form-model/ExpertReviewFormContent";

export class ExpertReview_8_1_2_15_NewFormContent extends ExpertReviewFormContent {

  novelty: string;
  noveltyText: string;

  economicSignificance: string;
  economicSignificanceText: string;

  resourcesSufficiency: string;
  resourcesSufficiencyText: string;

  competenceSufficiency: string;
  competenceSufficiencyText: string;

  marketingResearch: string;
  marketingResearchText: string;

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

  financeConclusion: boolean;
  financeConclusionText: string;
}
