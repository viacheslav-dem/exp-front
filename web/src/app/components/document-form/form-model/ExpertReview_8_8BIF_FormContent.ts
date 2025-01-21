
import {ExpertReviewFormContent} from "@app/components/document-form/form-model/ExpertReviewFormContent";
import {PeriodDto} from "@app/dto/PeriodDto";

export class ExpertReview_8_8BIF_FormContent extends ExpertReviewFormContent {

    novelty: string;
    noveltyText: string;
    scientificLevel: string;
    noveltyExists: boolean;
    noveltyExistsText: string;
    technologyType5: boolean;
    technologyType6: boolean;
    technologyOtherType: boolean;
    technologyTypeText: string;
    economicSignificance: string;
    economicSignificanceText: string;
    balance: number;
    balanceText: string;
    exportBalance: number;
    consequences: string;
    constructionWorks: boolean;
    constructionWorksText: string;
    projectDocs: boolean;
    neededProjectDocs: boolean;
    competenceSufficiency: string;
    competenceSufficiencyText: string;
    resourcesSufficiency: string;
    resourcesSufficiencyText: string;
    marketingResearch: string;
    marketingResearchText: string;
    scientificLevelOfInjectedTech: string;
    analog: string;
    analogText: string;
    analogParamsText: string;
    risks: string;
    risksText: string;
    industrialExpertiseText: string;
    nameAccordance: boolean;
    nameSuggestion: string;
    nameAccordanceText: string;
    termsAccordance: boolean;
    termsSuggestion: PeriodDto;
    termsAccordanceText: string;

    financeAccordance: boolean;
    financeValidity: string;

    financeConclusion: boolean;
    financeConclusionText: string;
    financeSuggestion: number;
    financeAccordanceText: string;

    targetAccordance: boolean;
    targetSuggestion: string;
    targetAccordanceText: string;

    isAccordance: boolean;

    projectDocsText: string;
    neededProjectDocsText: string
}

