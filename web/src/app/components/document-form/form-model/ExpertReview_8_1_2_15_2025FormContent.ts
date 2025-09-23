import {ExpertReviewFormContent} from "@app/components/document-form/form-model/ExpertReviewFormContent";
import {PeriodDto} from "@app/dto/PeriodDto";

export class ExpertReview_8_1_2_15_2025FormContent extends ExpertReviewFormContent {

    scientificResearch: string
    scientificResearchText: string

    novelty: string;
    noveltyText: string;

    economicSignificance: string;
    economicSignificanceText: string;

    commerce: string;
    commerceText: string;

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
    socialOrSecurity: boolean;
    socialOrSecurityText: string;

    financeAccordance: boolean;
    financeAccordanceText: string;
    financeSuggestion: number;

    softwareTool: number;
    softwareToolText: string;
    softwareToolSuggestion: string;


    financeConclusion: boolean;
    financeConclusionText: string;
}
