
import {ExpertReviewFormContent} from "@app/components/document-form/form-model/ExpertReviewFormContent";
import {PeriodDto} from "@app/dto/PeriodDto";

export class ExpertReview_8_8EAC_FormContent extends ExpertReviewFormContent {

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
    resourcesSufficiency: string;
    resourcesSufficiencyText: string;
    competenceSufficiency: string;
    competenceSufficiencyText: string;
    marketingResearch: string;
    marketingResearchText: string;
    scientificLevelOfInjectedTech: string;
    analog: string;
    analogText: string;
    analogParamsText: string;
    risks: string;
    risksText: string;
    privacyObjectsDescription: string;
    privacyObjectsDescriptionText: string;
    nameAccordance: boolean;
    nameSuggestion: string;
    nameAccordanceText: string;
    termsAccordance: boolean;
    termsSuggestion: PeriodDto = new PeriodDto();
    termsAccordanceText: string;
    financeAccordance: boolean;
    financeValidity: string;
    financeConclusion: boolean;
    financeSuggestion: number;
    financeConclusionText: string;
    targetAccordance: boolean;
    targetSuggestion: string;
    targetAccordanceText: string;

    isAccordance: boolean;

    isOpeningOfSubsidiaries: boolean;
    isParticipationInnovationAndInvestment: boolean;
    isBuyMaterialSupplies: boolean;
    isUseOfIntellectualProperty: boolean;

    isExportOriented: boolean;



}

