import {FormContent} from "@app/components/document-form/form-model/FormContent";
import {IdNameDto} from "@app/dto/IdNameDto";
import {PeriodDto} from "@app/dto/PeriodDto";
import {NewVoteResults} from "@app/components/document-form/meeting-protocol-form/NewVoteResults";

export class AgendaNewFormContent extends FormContent {

  productName: string;

  selectedDirections: IdNameDto[] = [];
  selectedSocialEconomicGoals: IdNameDto[] = [];
  
  directionsAndGoalsText: string;

  customerReplies: boolean;

  novelty: string;
  noveltyText: string;

  needs: string;
  needsText: string;

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

  privacyObjectsDescription: string;
  privacyObjectsDescriptionText: string;

  stagesExist: string;
  stagesExistText: string;

  stages: boolean;
  stagesText: string;

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

  sufficiency: boolean;
  sufficiencyText: string;

  sufficiencySuggestion: string;

  workSignificance: boolean;
  workSignificanceText;

  effect: boolean;
  effectText;

  workAccordance: boolean;
  workAccordanceText: string;

  assessment: boolean;
  assessmentText: string;

  accordance: boolean;
  accordanceText: string;

  effectAccordance: boolean;
  effectAccordanceText: string;

  scientificLevel: boolean;
  scientificLevelText: string;

  priorityAccordance: boolean;
  priorityAccordanceText: string;

  technology: boolean;
  technologyText: string;

  consequences: boolean;
  consequencesText: string;

  highTech: boolean;
  highTechText: string;

  highTechAccordance: boolean;
  highTechAccordanceText: string;

  noveltyAccordance: boolean;
  noveltyAccordanceText: string;

  wastelessness: boolean;
  wastelessnessText: string;

  exportOrientation: boolean;
  exportOrientationText: string;

  science: boolean;
  scienceText: string;

  addedValue: boolean;
  addedValueText: string;

  intellectualProperty: boolean;
  intellectualPropertyText: string;

  intellectualLabor: boolean;
  intellectualLaborText: string;

  innovative: boolean;
  innovativeText: string;

  patents: boolean;
  patentsText: string;

  advantage: boolean;
  advantageText: string;

  competitiveness: boolean;
  competitivenessText: string;

  programLevel: boolean;
  programLevelText: string;

  programSufficiency: boolean;
  programSufficiencyText: string;

  programRequirements: boolean;
  programRequirementsText: string;

  prognosis: boolean;
  prognosisText: string;

  targetAnalysis: boolean;
  targetAnalysisText: string;

  titleProtection:boolean;
  titleProtectionText:string;

  cofTech:string;

  conclusionText: string;

  economicActivity: boolean;
  economicActivityText: string;

  basedOnHighTech: boolean;
  basedOnHighTechText: string;

  importOrientation: boolean;
  importOrientationText: string;

  catalogHighTech: boolean;
  conclusion: NewVoteResults = new NewVoteResults();

  percentageOfImportToExport: string;
  percentageOfExportToImport: string;

  correspondenceOfProductName: string;
  correspondenceOfHighTechProduction: string;

  technologyType5: boolean;
  technologyType6: boolean;
  technologyOtherType: boolean;
  technologyTypeText: string;

  neededProjectDocs: boolean;
  neededProjectDocsText: string;
}
