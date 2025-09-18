import {ExpertReviewFormContent} from "@app/components/document-form/form-model/ExpertReviewFormContent";
import {IndustryDto} from "@app/dto/IndustryDto";
import {Text} from "@app/components/document-form/form-model/Text";
import {PeriodDto} from "@app/dto/PeriodDto";

export class ExpertReview_8_5_7_8_12IP_2025FormContent extends ExpertReviewFormContent {

    priorityAreas: boolean;

    priorityAreasSuggestion: string;

    priorityAreasText: string;

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

    section: IndustryDto;
    sectionText: string;

    addedValue: number;
    addedValueText: string;

    balance: number;
    balanceText: string;

    consequences: string;

    resourcesSufficiency: string;
    resourcesSufficiencyText: string;

    competenceSufficiency: string;
    competenceSufficiencyText: string;

    marketingResearch: string;

    marketingResearchText: string;

    scientificLevelItems: Text[] = [];
    scientificLevelItemsText: string;

    analog: string;
    analogText: string;

    analogParamsText: string;

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

    constructionWorks: boolean;
    constructionWorksLabel: string;


    constructionWorksText: string;

    projectDocsLabel:string;
    projectDocs: boolean;
    projectDocsText: string;

    neededProjectDocsLabel:string;
    neededProjectDocs: boolean;
    neededProjectDocsText: string;

}

