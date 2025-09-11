import {NgModule} from "@angular/core";
import {ExpertReview_8_3_4_5_7_8_FormComponent} from "@app/components/document-form/expert-review-8-3-4-5-7-8-form/expert-review-8-3-4-5-7-8-form.component";
import {DocumentFormContainerComponent} from "@app/components/document-form/document-form-container/document-form-container.component";
import {ExpertReview_8_1_FormComponent} from "@app/components/document-form/expert-review-8-1-form/expert-review-8-1-form.component";
import {ExpertReview_8_2_FormComponent} from "@app/components/document-form/expert-review-8-2-form/expert-review-8-2-form.component";
import {ExpertReview_8_11_14_FormComponent} from "@app/components/document-form/expert-review-8-11-14-form/expert-review-8-11-14-form.component";
import {ExpertReview_8_12NIOKTR_FormComponent} from "@app/components/document-form/expert-review-8-12NIOKTR-form/expert-review-8-12NIOKTR-form.component";
import {ExpertReview_8_6_FormComponent} from "@app/components/document-form/expert-review-8-6-form/expert-review-8-6-form.component";
import {ExpertReview_8_9_FormComponent} from "@app/components/document-form/expert-review-8-9-form/expert-review-8-9-form.component";
import {ExpertReview_8_10PIT_FormComponent} from "@app/components/document-form/expert-review-8-10PIT-form/expert-review-8-10PIT-form.component";
import {ExpertReview_8_13_FormComponent} from "@app/components/document-form/expert-review-8-13-form/expert-review-8-13-form.component";
import {ExpertReview_8_15_FormComponent} from "@app/components/document-form/expert-review-8-15-form/expert-review-8-15-form.component";
import {ExpertReview_8_10PVT_FormComponent} from "@app/components/document-form/expert-review-8-10PVT-form/expert-review-8-10PVT-form.component";
import {ExpertReview_8_12IP_FormComponent} from "@app/components/document-form/expert-review-8-12IP-form/expert-review-8-12IP-form.component";
import {DecisionDocumentFormComponent} from "@app/components/document-form/decision-document-form/decision-document-form.component";
import {ReferralFormComponent} from "@app/components/document-form/referral-form/referral-form.component";
import {CommonComponentsModule} from "@app/components/common-components/components.module";
import {ExpertReviewFormContainerComponent} from "@app/components/document-form/expert-review-form-container/expert-review-form-container.component";
import {MeetingProtocolFormComponent} from "@app/components/document-form/meeting-protocol-form/meeting-protocol-form.component";
import {SearchModule} from "@app/components/search/search.module";
import {ExpertReviewFormResolver} from "@app/components/document-form/expert-review-form-container/expert-review-form-resolver.service";
import {AgendaFormResolver} from "@app/components/document-form/meeting-protocol-form/agenda-form-resolver.service";
import {Agenda_8_1_FormComponent} from "@app/components/document-form/agenda-8-1-form/agenda-8-1-form.component";
import {VoteResultsComponent} from "@app/components/document-form/vote-results/vote-results.component";
import {Agenda_8_15_FormComponent} from "@app/components/document-form/agenda-8-15-form/agenda-8-15-form.component";
import {Agenda_8_9_FormComponent} from "@app/components/document-form/agenda-8-9-form/agenda-8-9-form.component";
import {Agenda_8_12IP_FormComponent} from "@app/components/document-form/agenda-8-12IP-form/agenda-8-12IP-form.component";
import {Agenda_8_10PIT_FormComponent} from "@app/components/document-form/agenda-8-10PIT-form/agenda-8-10PIT-form.component";
import {Agenda_8_10PVT_FormComponent} from "@app/components/document-form/agenda-8-10PVT-form/agenda-8-10PVT-form.component";
import {Agenda_8_13_FormComponent} from "@app/components/document-form/agenda-8-13-form/agenda-8-13-form.component";
import {Agenda_8_6_FormComponent} from "@app/components/document-form/agenda-8-6-form/agenda-8-6-form.component";
import {CouncilConclusionFormContainerComponent} from "@app/components/document-form/council-conclusion-form/council-conclusion-form-container.component";
import {ExpertReview_8_1_2_15_NewFormComponent} from "@app/components/document-form/expert-review-8-1-2-15-new-form/expert-review-8-1-2-15-new-form.component";
import {NoveltyBlockComponent} from "@app/components/document-form/document-blocks/novelty-block.component";
import {EconomicSignificanceBlockComponent} from "@app/components/document-form/document-blocks/economic-significance-block.component";
import {ResourcesSufficiencyBlockComponent} from "@app/components/document-form/document-blocks/resources-sufficiency-block.component";
import {CompetenceSufficiencyBlockComponent} from "@app/components/document-form/document-blocks/competence-sufficiency-block.component";
import {MarketingResearchBlockComponent} from "@app/components/document-form/document-blocks/marketing-research-block.component";
import {RisksBlockComponent} from "@app/components/document-form/document-blocks/risks-block.component";
import {PrivacyBlockComponent} from "@app/components/document-form/document-blocks/privacy-block.component";
import {StagesExistsBlockComponent} from "@app/components/document-form/document-blocks/stages-exists-block.component";
import {NameAccordanceBlockComponent} from "@app/components/document-form/document-blocks/name-accordance-block.component";
import {TermsAccordanceBlockComponent} from "@app/components/document-form/document-blocks/terms-accordance-block.component";
import {FinanceAccordanceBlockComponent} from "@app/components/document-form/document-blocks/finance-accordance-block.component";
import {FinanceConclusionBlockComponent} from "@app/components/document-form/document-blocks/finance-conclusion-block.component";
import {ConclusionBlockComponent} from "@app/components/document-form/document-blocks/conclusion-block.component";
import {NotesBlockComponent} from "@app/components/document-form/document-blocks/notes-block.component";
import {TargetBlockComponent} from "@app/components/document-form/document-blocks/target-block.component";
import {ExpertReview_8_3_4_12NIOKTR_NewFormComponent} from "@app/components/document-form/expert-review-8-3-4-12NIOKTR-new-form/expert-review-8-3-4-12NIOKTR-new-form.component";
import {CompetitivenessBlockComponent} from "@app/components/document-form/document-blocks/competitiveness-block.component";
import {AnalogBlockComponent} from "@app/components/document-form/document-blocks/analog-block.component";
import {AnalogParamsBlockComponent} from "@app/components/document-form/document-blocks/analog-params-block.component";
import {NeedsBlockComponent} from "@app/components/document-form/document-blocks/needs-block.component";
import {TargetAccordanceBlockComponent} from "@app/components/document-form/document-blocks/target-accordance-block.component";
import {ExpertReview_8_5_7_8_12IP_NewFormComponent} from "@app/components/document-form/expert-review-8-5-7-8-12IP-new-form/expert-review-8-5-7-8-12IP-new-form.component";
import {ScientificLevelBlockComponent} from "@app/components/document-form/document-blocks/scientific-level-block.component";
import {NoveltyExistsBlockComponent} from "@app/components/document-form/document-blocks/novelty-exists-block.component";
import {TechnologyTypeBlockComponent} from "@app/components/document-form/document-blocks/technology-type-block.component";
import {SectionBlockComponent} from "@app/components/document-form/document-blocks/section-block.component";
import {AddedValueBlockComponent} from "@app/components/document-form/document-blocks/added-value-block.component";
import {AddedValueInBoundBlockComponent} from "@app/components/document-form/document-blocks/added-value-in-bound-block.component";
import {BalanceBlockComponent} from "@app/components/document-form/document-blocks/balance-block.component";
import {ExportBlockComponent} from "@app/components/document-form/document-blocks/export-block.component";
import {ConsequencesBlockComponent} from "@app/components/document-form/document-blocks/consequences-block.component";
import {MarketingResearchPlainBlockComponent} from "@app/components/document-form/document-blocks/marketing-research-plain-block.component";
import {MarketingResearchResultsBlockComponent} from "@app/components/document-form/document-blocks/marketing-research-results-block.component";
import {ScientificLevelItemsBlockComponent} from "@app/components/document-form/document-blocks/scientific-level-items-block.component";
import {AnalogDescriptionBlockComponent} from "@app/components/document-form/document-blocks/analog-description-block.component";
import {AnalogParamsDescriptionBlockComponent} from "@app/components/document-form/document-blocks/analog-params-description-block.component";
import {ResultsBlockComponent} from "@app/components/document-form/document-blocks/results-block.component";
import {ExpertReview_8_6_NewFormComponent} from "@app/components/document-form/expert-review-8-6-new-form/expert-review-8-6-new-form.component";
import {EffectivenessBlockComponent} from "@app/components/document-form/document-blocks/effectiveness-block.component";
import {ResultAccordanceBlockComponent} from "@app/components/document-form/document-blocks/result-accordance-block.component";
import {EffectAccordanceBlockComponent} from "@app/components/document-form/document-blocks/effect-accordance-block.component";
import {Conclusion_8_6_BlockComponent} from "@app/components/document-form/document-blocks/conclusion-8-6-block.component";
import {ExpertReview_8_9_NewFormComponent} from "@app/components/document-form/expert-review-8-9-new-form/expert-review-8-9-new-form.component";
import {ScientificLevelExBlockComponent} from "@app/components/document-form/document-blocks/scientific-level-ex-block.component";
import {PriorityAccordanceBlockComponent} from "@app/components/document-form/document-blocks/priority-accordance-block.component";
import {TechnologyBlockComponent} from "@app/components/document-form/document-blocks/technology-block.component";
import {Conclusion_8_9_BlockComponent} from "@app/components/document-form/document-blocks/conclusion-8-9-block.component";
import {ExpertReview_8_10PVT_NewFormComponent} from "@app/components/document-form/expert-review-8-10PVT-new-form/expert-review-8-10PVT-form.component";
import {ExpertReview_8_10PIT_NewFormComponent} from "@app/components/document-form/expert-review-8-10PIT-new-form/expert-review-8-10PIT-new-form.component";
import {ProductNameBlockComponent} from "@app/components/document-form/document-blocks/product-name-block.component";
import {PatentsBlockComponent} from "@app/components/document-form/document-blocks/patents-block.component";
import {AdvantageBlockComponent} from "@app/components/document-form/document-blocks/advantage-block.component";
import {ProductCompetitivenessBlockComponent} from "@app/components/document-form/document-blocks/product-competitiveness-block.component";
import {Conclusion810PITBlockComponent} from "@app/components/document-form/document-blocks/conclusion-8-10PIT-block.component";
import {ExpertReview_8_11_14_NewFormComponent} from "@app/components/document-form/expert-review-8-11-14-new-form/expert-review-8-11-14-new-form.component";
import {SignificanceBlockComponent} from "@app/components/document-form/document-blocks/significance-block.component";
import {EffectBlockComponent} from "@app/components/document-form/document-blocks/effect-block.component";
import {SufficiencyBlockComponent} from "@app/components/document-form/document-blocks/sufficiency-block.component";
import {UsersBlockComponent} from "@app/components/document-form/document-blocks/users-block.component";
import {CharacteristicsBlockComponent} from "@app/components/document-form/document-blocks/characteristics-block.component";
import {WorkAccordanceBlockComponent} from "@app/components/document-form/document-blocks/work-accordance-block.component";
import {RequirementsBlockComponent} from "@app/components/document-form/document-blocks/requirements-block.component";
import {AssessmentBlockComponent} from "@app/components/document-form/document-blocks/assessment-block.component";
import {Conclusion_8_11_14_BlockComponent} from "@app/components/document-form/document-blocks/conclusion-8-11-14-block.component";
import {ExpertReview_8_13_NewFormComponent} from "@app/components/document-form/expert-review-8-13-new-form/expert-review-8-13-new-form.component";
import {ProgramRequirementsBlockComponent} from "@app/components/document-form/document-blocks/program-requirements-block.component";
import {PrognosisBlockComponent} from "@app/components/document-form/document-blocks/prognosis-block.component";
import {TargetAnalysisBlockComponent} from "@app/components/document-form/document-blocks/target-analysis-block.component";
import {ProgramSufficiencyBlockComponent} from "@app/components/document-form/document-blocks/program-sufficiency-block.component";
import {Conclusion_8_13_BlockComponent} from "@app/components/document-form/document-blocks/conclusion-8-13-block.component";
import {SelectDirectionsAndGoalsBlockComponent} from "@app/components/document-form/document-blocks/select-directions-and-goals-block.component";
import {Agenda_8_1_2_NewFormComponent} from "@app/components/document-form/agenda-8-1-2-new-form/agenda-8-1-2-new-form.component";
import {RbNeedsBlockComponent} from "@app/components/document-form/document-blocks/rb-needs-block.component";
import {StagesBlockComponent} from "@app/components/document-form/document-blocks/stages-block.component";
import {NewVoteResultsComponent} from "@app/components/document-form/new-vote-results/new-vote-results.component";
import {ConclusionSectionBlockComponent} from "@app/components/document-form/document-blocks/conclusion-section-block.component";
import {Agenda_8_3_4_5_7_8_11_12NIOKTR_NewFormComponent} from "@app/components/document-form/agenda-8-3-4-5-7-8-11-12NIOKTR-new-form/agenda-8-3-4-5-7-8-11-12NIOKTR-new-form.component";
import {AgendaHeaderBlockComponent} from "@app/components/document-form/document-blocks/agenda-header-block.component";
import {CustomerRepliesBlockComponent} from "@app/components/document-form/document-blocks/customer-replies-block.component";
import {Agenda_8_14_NewFormComponent} from "@app/components/document-form/agenda-8-14-new-form/agenda-8-14-new-form.component";
import {AssessmentConclusionBlockComponent} from "@app/components/document-form/document-blocks/assessment-conclusion-block.component";
import {Agenda_8_6_NewFormComponent} from "@app/components/document-form/agenda-8-6-new-form/agenda-8-6-new-form.component";
import {Agenda_8_9_NewFormComponent} from "@app/components/document-form/agenda-8-9-new-form/agenda-8-9-new-form.component";
import {ScientificLevelConclusionBlockComponent} from "@app/components/document-form/document-blocks/scientific-level-conclusion-block.component";
import {PriorityAccordanceConclusionBlockComponent} from "@app/components/document-form/document-blocks/priority-accordance-conclusion-block.component";
import {ConsequencesConclusionBlockComponent} from "@app/components/document-form/document-blocks/consequences-conclusion-block.component";
import {HighTechBlockComponent} from "@app/components/document-form/document-blocks/high-tech-block.component";
import {Agenda_8_10PVT_NewFormComponent} from "@app/components/document-form/agenda-8-10PVT-new-form/agenda-8-10PVT-new-form.component";
import {Agenda_8_10PIT_NewFormComponent} from "@app/components/document-form/agenda-8-10PIT-new-form/agenda-8-10PIT-new-form.component";
import {InnovativeBlockComponent} from "@app/components/document-form/document-blocks/innovative-block.component";
import {Agenda_8_12IP_NewFormComponent} from "@app/components/document-form/agenda-8-12IP-new-form/agenda-8-12IP-new-form.component";
import {Agenda_8_13_NewFormComponent} from "@app/components/document-form/agenda-8-13-new-form/agenda-8-13-new-form.component";
import {ProgramLevelBlockComponent} from "@app/components/document-form/document-blocks/program-level-block.component";
import {ProgramSufficiencyFinanceBlockComponent} from "@app/components/document-form/document-blocks/program-sufficiency-finance-block.component";
import {Agenda_8_15_NewFormComponent} from "@app/components/document-form/agenda-8-15-new-form/agenda-8-15-new-form.component";
import {CouncilConclusionFormResolver} from "@app/components/document-form/council-conclusion-form/council-conclusion-form-resolver.service";
import {CouncilConclusion_8_1_2_FormComponent} from "@app/components/document-form/council-conclusion-8-1-2-form/council-conclusion-8-1-2-form.component";
import {ConclusionCouncilBlockComponent} from "@app/components/document-form/document-blocks/conclusion-council-block.component";
import {CouncilConclusion_8_3_4_5_7_8_12_15_FormComponent} from "@app/components/document-form/council-conclusion-8-3-4-5-7-8-12-15-form/council-conclusion-8-3-4-5-7-8-12-15-form.component";
import {CouncilConclusion_8_9_FormComponent} from "@app/components/document-form/council-conclusion-8-9-form/council-conclusion-8-9-form.component";
import {CouncilConclusion_8_10PVT_FormComponent} from "@app/components/document-form/council-conclusion-8-10PVT-form/council-conclusion-8-10PVT-form.component";
import {HighTechAccordanceBlockComponent} from "@app/components/document-form/document-blocks/high-tech-accordance-block.component";
import {NoveltyAccordanceBlockComponent} from "@app/components/document-form/document-blocks/novelty-accordance-block.component";
import {WastelessnessBlockComponent} from "@app/components/document-form/document-blocks/wastelessness-block.component";
import {ScienceBlockComponent} from "@app/components/document-form/document-blocks/science-block.component";
import {AddedValueAccordanceBlockComponent} from "@app/components/document-form/document-blocks/added-value-accordance-block.component";
import {IntellectualPropertyBlockComponent} from "@app/components/document-form/document-blocks/intellectual-property-block.component";
import {IntellectualLaborBlockComponent} from "@app/components/document-form/document-blocks/intellectual-labor-block.component";
import {CouncilConclusion_8_10PIT_FormComponent} from "@app/components/document-form/council-conclusion-8-10PIT-form/council-conclusion-8-10PIT-form.component";
import {PatentsAccordanceBlockComponent} from "@app/components/document-form/document-blocks/patents-accordance-block.component";
import {AdvantageAccordanceBlockComponent} from "@app/components/document-form/document-blocks/advantage-accordance-block.component";
import {CompetitivenessAccordanceBlockComponent} from "@app/components/document-form/document-blocks/competitiveness-accordance-block.component";
import {CouncilConclusion_8_11_14_FormComponent} from "@app/components/document-form/council-conclusion-8-11-14-form/council-conclusion-8-11-14-form.component";
import {WorkSignificanceBlockComponent} from "@app/components/document-form/document-blocks/work-significance-block.component";
import {EffectConclusionBlockComponent} from "@app/components/document-form/document-blocks/effect-conclusion-block.component";
import {CouncilConclusion_8_13_FormComponent} from "@app/components/document-form/council-conclusion-8-13-form/council-conclusion-8-13-form.component";
import {CouncilConclusion_8_6_FormComponent} from "@app/components/document-form/council-conclusion-8-6-form/council-conclusion-8-6-form.component";
import {ReturnFromCouncilWithoutExpertiseFormComponent} from "@app/components/document-form/return-from-council-without-expertise-form/return-from-council-without-expertise-form.component";
import {ConstructionWorkBlockComponent} from "@app/components/document-form/document-blocks/construction-work-block.component"
import {ProjectDocsBlockComponent} from "@app/components/document-form/document-blocks/project-docs-block.component"
import {NeededProjectDocsBlockComponent} from "@app/components/document-form/document-blocks/needed-project-docs-block.component"
import {TitleProtectionBlockComponent} from "@app/components/document-form/document-blocks/title-protection-block.component"
import {CofTechBlockComponent} from "@app/components/document-form/document-blocks/cof-tech-block.component"
import {ConclusionCouncilHightechBlockComponent} from "@app/components/document-form/document-blocks/conclusion-council-hightech-block.component"
import {
  ExpertReview_8_16_FormComponent
} from "@app/components/document-form/expert-review-8-16-form/expert-review-8-16-form.component";
import {EconomicActivityBlockComponent} from "@app/components/document-form/document-blocks/economic-activity-block";
import {BasedOnHighTechBlockComponent} from "@app/components/document-form/document-blocks/based-on-high-tech-block";
import {ImportOrientationBlockComponent} from "@app/components/document-form/document-blocks/import-orientation-block";
import {ExportOrientatedBlockComponent} from "@app/components/document-form/document-blocks/export-orientated-block";
import {
  ExportOrientationBlockComponent
} from "@app/components/document-form/document-blocks/export-orientation-block.component";
import {
  CatalogHighTechBlockComponent
} from "@app/components/document-form/document-blocks/catalog-high-tech-block.component";
import {
  Conclusion_8_16_BlockComponent
} from "@app/components/document-form/document-blocks/conclusion-8-16-block.component";
import {
  CouncilConclusion_8_16_FormComponent
} from "@app/components/document-form/council-conclusion-8-16-form/council-conclusion-8-16-form.component";
import {
  ExpertReview_8_8EAC_FormComponent
} from "@app/components/document-form/expert-review-8-8EAC-form/expert-review-8-8EAC-form-componen";
import {
  ExpertReview_8_8BIF_FormComponent
} from "@app/components/document-form/expert-review-8-8BIF-form/expert-review-8-8BIF-form-component";
import {ExportBalanceBlockComponent} from "@app/components/document-form/document-blocks/export-balance-block-component";
import {
  ScientificLevelOfInjectedTechBlockComponent
} from "@app/components/document-form/document-blocks/scientific-level-of-injected-tech-block.component";
import {
  FinanceAccordanceConclusionBlockComponent
} from "@app/components/document-form/document-blocks/finance-accordance-conclusion-block.component";
import {
  CreationIndustrialExpertiseBlock
} from "@app/components/document-form/document-blocks/сreation-industrial-expertise-block.component";
import {
  CouncilConclusion_8_8BIF_FormComponent
} from "@app/components/document-form/council-conclusion-8-BIF-form/council-conclusion-8-8BIF-form.component";
import {
  EconomicSignificance_8_8_BlockComponent
} from "@app/components/document-form/document-blocks/app-economic-significance-8-8-block";
import {
  ExportOrientedBlockComponent
} from "@app/components/document-form/document-blocks/export-oriented-block";
import {DocumentAccordanceBlock} from "@app/components/document-form/document-blocks/document-accordance-block";
import {
  EconomicSignificance88BIFBlockComponent
} from "@app/components/document-form/document-blocks/economic-significance-8-8BIF-block.component";
import {
  MarketingResearchPlainBifBlockComponent
} from "@app/components/document-form/document-blocks/marketing-research-plain-8-8-bif-block";
import {
  PvtProductNamingBlockComponent
} from "@app/components/document-form/document-blocks/pvt-product-naming-block.component";
import {
  PvtAgendaCofTechBlockComponent
} from "@app/components/document-form/document-blocks/pvt-agenda-cof-tech-block.component";
import {
  Agenda_8_16_NewFormComponent
} from "@app/components/document-form/agenda-8-16-new-form/agenda-8-16-new-form.component";
import {
  PercentageOfImportToExportBlockComponent
} from "@app/components/document-form/document-blocks/percentage-of-import-to-export-block.component";
import {
  CorrespondenceOfProductNameComponent
} from "@app/components/document-form/document-blocks/correspondence-of-product-name.component";
import {NewAndHighTechComponent} from "@app/components/document-form/document-blocks/new-and-high-tech.component";
import {
  PercentageOfExportToImportBlockComponent
} from "@app/components/document-form/document-blocks/percentage-of-export-to-import-block.component";
import {
  Agenda_8_8_Bif_Eac_FormComponent
} from "@app/components/document-form/agenda-8-8-bif-eac-form/agenda-8-8-bif-eac-form.component";
import { ExpertReview_8_1_2_15_2025FormComponent } from './expert-review-8-1-2-15-2025-form/expert-review_8_1_2_15_2025-form.component';
import {NoveltyBlock2025Component} from "@app/components/document-form/document-blocks/novelty-block-2025.component";
import {
  EconomicSignificanceBlock2025Component
} from "@app/components/document-form/document-blocks/economic-significance-block-2025.component";
import {
  CommerceBlock2025Component
} from "@app/components/document-form/document-blocks/commerce-block-2025.components";
import {
  ResourcesSufficiencyBlock2025Component
} from "@app/components/document-form/document-blocks/resources-sufficiency-block-2025.component";
import {
  CompetenceSufficiencyBlock2025Component
} from "@app/components/document-form/document-blocks/competence-sufficiency-block-2025.component";
import {
  MarketingResearchBlock2025Component
} from "@app/components/document-form/document-blocks/marketing-research-block-2025.component";
import {RisksBlock2025Component} from "@app/components/document-form/document-blocks/risks-block-2025.component";
import {PrivacyBlock2025Component} from "@app/components/document-form/document-blocks/privacy-block-2025.component";
import {
  StagesExistsBlock2025Component
} from "@app/components/document-form/document-blocks/stages-exists-block-2025.components";
import {
  SocialOrSecurityBlock2025Component
} from "@app/components/document-form/document-blocks/social-or-security-block-2025.component";
import {
  FinanceAccordanceBlock2025Component
} from "@app/components/document-form/document-blocks/finance-accordance-block-2025.component";
import {
  SoftwareToolBlock2025Component
} from "@app/components/document-form/document-blocks/software-tool-block-2025.component";
import { ExpertReview_8_3_4_12NIOKTR_2025FormComponent } from './expert-review-8-3-4-12NIOKTR-2025-form/expert-review_8_3_4_12-n-i-o-k-t-r_2025-form.component';
import {
  ScientificResearchBlock2025Component
} from "@app/components/document-form/document-blocks/scientific-research-block-2025.component";
import {TaskListsBlock2025Component} from "@app/components/document-form/document-blocks/task-lists-block-2025.component";
import {
  TechnologicalOrderBlock2025Component
} from "@app/components/document-form/document-blocks/technological-order-block-2025.component";
import {TargetBlock2025Component} from "@app/components/document-form/document-blocks/target-block-2025.component";
import {
  CompetitivenessBlock2025Component
} from "@app/components/document-form/document-blocks/competitiveness-block-2025.component";
import {AnalogBlock2025Component} from "@app/components/document-form/document-blocks/analog-block-2025.component";
import {
  AnalogParamsBlock2025Component
} from "@app/components/document-form/document-blocks/analog-params-block-2025.component";
import {NeedsBlock2025Component} from "@app/components/document-form/document-blocks/needs-block-2025.component";
import {
  NameAccordanceBlock2025Component
} from "@app/components/document-form/document-blocks/name-accordance-block-2025.component";
import {
  TermsAccordanceBlock2025Component
} from "@app/components/document-form/document-blocks/terms-accordance-block-2025.component";
import {
  FinanceConclusionBlock2025Component
} from "@app/components/document-form/document-blocks/finance-conclusion-block-2025.component";
import {
  TargetAccordanceBlock2025Component
} from "@app/components/document-form/document-blocks/target-accordance-block-2025.component";
import { ExpertReview_8_5_7_8_12IP_2025FormComponent } from './expert-review-8-5-7-8-12IP-2025-form/expert-review_8_5_7_8_12-i-p_2025-form.component';
import {
  ScientificLevelBlock2025Component
} from "@app/components/document-form/document-blocks/scientific-level-block-2025.component";
import {
  NoveltyExistsBlock2025Component
} from "@app/components/document-form/document-blocks/novelty-exists-block-2025.component";
import {
  TechnologyTypeBlock2025Component
} from "@app/components/document-form/document-blocks/technology-type-block-2025.component";
import {SectionBlock2025Component} from "@app/components/document-form/document-blocks/section-block-2025.component";
import {
  AddedValueBlock2025Component
} from "@app/components/document-form/document-blocks/added-value-block-2025.component";
import {
  AddedValueInBoundBlock2025Component
} from "@app/components/document-form/document-blocks/added-value-in-bound-block-2025.component";
import {BalanceBlock2025Component} from "@app/components/document-form/document-blocks/balance-block-2025.component";
import {ExportBlock2025Component} from "@app/components/document-form/document-blocks/export-block-2025.componennt";
import {
  ConsequencesBlock2025Component
} from "@app/components/document-form/document-blocks/consequences-block-2025.component";
import {
  ConstructionWorkBlock2025Component
} from "@app/components/document-form/document-blocks/construction-work-block-2025.component";
import {
  ProjectDocsBlock2025Component
} from "@app/components/document-form/document-blocks/project-docs-block-2025.component";
import {
  NeededProjectDocsBlock2025Component
} from "@app/components/document-form/document-blocks/needed-project-docs-block-2025.component";
import {
  MarketingResearchResultsBlock2025Component
} from "@app/components/document-form/document-blocks/marketing-research-results-block-2025.component";
import { ExpertReview_8_14_2025FormComponent } from './expert-review-8-14-2025-form/expert-review_8_14_2025-form.component';
import {SignificanceBlock2025Component} from "@app/components/document-form/document-blocks/significance-block-2025";
import {EffectBlock2025Component} from "@app/components/document-form/document-blocks/effect-block-2025.component";
import {
  SufficiencyBlock2025Component
} from "@app/components/document-form/document-blocks/sufficiency-block-2025.component";
import {UsersBlock2025Component} from "@app/components/document-form/document-blocks/users-block-2025.component";
import {
  CharacteristicsBlock2025Component
} from "@app/components/document-form/document-blocks/characteristics-block-2025.component";
import {
  WorkAccordanceBlock2025Component
} from "@app/components/document-form/document-blocks/work-accordance-block-2025.component";
import {
  RequirementsBlock2025Component
} from "@app/components/document-form/document-blocks/requirements-block-2025.component";
import {
  Conclusion_8_14_BlockComponent
} from "@app/components/document-form/document-blocks/conclusion-8-14-block-2025.component";
import {
  ExpertReview_8_13_2025FormComponent
} from './expert-review-8-13-2025-form/expert-review_8_13_2025-form.component';
import {
  ExpertReview_8_13_2025FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_13_2025FormContent";
import {
  SocioEconomivDev2025Component
} from "@app/components/document-form/document-blocks/socio-economic-dev-2025.component";
import {
  ProgramRequirementsBlock2025Component
} from "@app/components/document-form/document-blocks/program-requirements-block-2025.component";
import {
  PrognosisBlock2025Component
} from "@app/components/document-form/document-blocks/prognosis-block-2025.component";
import {
  TargetAnalysisBlock2025Component
} from "@app/components/document-form/document-blocks/target-analysis-block-2025.component";
import {
  ProgramSufficiencyBlock2025Component
} from "@app/components/document-form/document-blocks/program-sufficiency-block-2025.component";
import {
  Conclusion_8_13_Block2025Component
} from "@app/components/document-form/document-blocks/conclusion-8-13-block-2025.component";
import {
  PriorityAreasBlock2025Components
} from "@app/components/document-form/document-blocks/priority-areas-block-2025.components";
import {
  AvailabilityOfDocumentsBlock2025Component
} from "@app/components/document-form/document-blocks/availability-of-documents-block-2025.component";
import {
    DeadlinesComplianceBlockComponent
} from "@app/components/document-form/document-blocks/deadlines-compilance-block/deadlines-compilance-block.component";
import {
    CouncilConclusion_8_14_2025_FormComponent
} from "@app/components/document-form/council-conclusion-8-14-form-2025/council-conclusion-8-14-form-2025.component";
import {
  SelectDirectionsAndGoalsBlock2025Component
} from "@app/components/document-form/document-blocks/select-directions-and-goals-block-2025.component";
import {
  CompetitivenessBlockAgenda2025Component
} from "@app/components/document-form/document-blocks/competitiveness-block-agenda-2025.component";
import {StagesBlock2025Component} from "@app/components/document-form/document-blocks/stages-block-2025.component";
import {RbNeedsBlock2025Component} from "@app/components/document-form/document-blocks/rb-needs-block-2025.component";
import {
  Agenda_8_1_2_3_4_5_7_8_12NIOKTR_14_2025_FormComponent,
} from "@app/components/document-form/agenda-8-1-2-3-4-5-7-8-12NIOKTR-14-2025-form/agenda-8-1-2-3-4-5-7-8-12NIOKTR-14-2025-form";
import {
  AssessmentConclusionBlock2025Component
} from "@app/components/document-form/document-blocks/assessment-conclusion-block-2025.component";
import {
  Agenda_8_12IP_2025FormComponent
} from "@app/components/document-form/agenda-8-12IP-2025-form/agenda-8-12IP-2025-form.component";
import {
  Agenda_8_15_2025FormComponent
} from "@app/components/document-form/agenda-8-15-2025-form/agenda-8-15-2025-form.component";

@NgModule({
  imports: [
    CommonComponentsModule,
    SearchModule,
  ],
  entryComponents: [
    ExpertReview_8_1_FormComponent,
    ExpertReview_8_1_2_15_NewFormComponent,
    ExpertReview_8_1_2_15_2025FormComponent,
    ExpertReview_8_3_4_12NIOKTR_NewFormComponent,
    ExpertReview_8_3_4_12NIOKTR_2025FormComponent,
    ExpertReview_8_5_7_8_12IP_NewFormComponent,
    ExpertReview_8_5_7_8_12IP_2025FormComponent,
    ExpertReview_8_10PVT_NewFormComponent,
    ExpertReview_8_6_NewFormComponent,
    ExpertReview_8_9_NewFormComponent,
    ExpertReview_8_10PIT_NewFormComponent,
    ExpertReview_8_11_14_NewFormComponent,
    ExpertReview_8_14_2025FormComponent,
    ExpertReview_8_13_NewFormComponent,
    ExpertReview_8_2_FormComponent,
    ExpertReview_8_3_4_5_7_8_FormComponent,
    ExpertReview_8_6_FormComponent,
    ExpertReview_8_9_FormComponent,
    ExpertReview_8_10PIT_FormComponent,
    ExpertReview_8_10PVT_FormComponent,
    ExpertReview_8_11_14_FormComponent,
    ExpertReview_8_12IP_FormComponent,
    ExpertReview_8_12NIOKTR_FormComponent,
    ExpertReview_8_13_2025FormComponent,
    ExpertReview_8_13_FormComponent,
    ExpertReview_8_15_FormComponent,
    ExpertReview_8_16_FormComponent,
    ExpertReview_8_8EAC_FormComponent,
    ExpertReview_8_8BIF_FormComponent,
    Agenda_8_1_FormComponent,
    Agenda_8_15_FormComponent,
    Agenda_8_9_FormComponent,
    Agenda_8_12IP_FormComponent,
    Agenda_8_10PIT_FormComponent,
    Agenda_8_10PVT_FormComponent,
    Agenda_8_13_FormComponent,
    Agenda_8_6_FormComponent,
    VoteResultsComponent,
    Agenda_8_1_2_NewFormComponent,
    Agenda_8_3_4_5_7_8_11_12NIOKTR_NewFormComponent,
    Agenda_8_1_2_3_4_5_7_8_12NIOKTR_14_2025_FormComponent,
    Agenda_8_8_Bif_Eac_FormComponent,
    Agenda_8_14_NewFormComponent,
    Agenda_8_6_NewFormComponent,
    Agenda_8_10PVT_NewFormComponent,
    Agenda_8_9_NewFormComponent,
    Agenda_8_10PIT_NewFormComponent,
    Agenda_8_12IP_NewFormComponent,
    Agenda_8_12IP_2025FormComponent,
    Agenda_8_13_NewFormComponent,
    Agenda_8_15_NewFormComponent,
    Agenda_8_15_2025FormComponent,
    Agenda_8_16_NewFormComponent,
    CouncilConclusion_8_1_2_FormComponent,
    CouncilConclusion_8_3_4_5_7_8_12_15_FormComponent,
    CouncilConclusion_8_9_FormComponent,
    CouncilConclusion_8_10PVT_FormComponent,
    CouncilConclusion_8_10PIT_FormComponent,
    CouncilConclusion_8_11_14_FormComponent,
    CouncilConclusion_8_13_FormComponent,
    CouncilConclusion_8_6_FormComponent,
    CouncilConclusion_8_16_FormComponent,
    CouncilConclusion_8_14_2025_FormComponent,
    CouncilConclusion_8_8BIF_FormComponent
  ],
  declarations: [
    PriorityAreasBlock2025Components,
    ExpertReviewFormContainerComponent,
    DocumentFormContainerComponent,
    ExpertReview_8_1_FormComponent,
    ExpertReview_8_1_2_15_NewFormComponent,
    ExpertReview_8_2_FormComponent,
    ExpertReview_8_3_4_5_7_8_FormComponent,
    ExpertReview_8_6_FormComponent,
    ExpertReview_8_9_FormComponent,
    ExpertReview_8_10PIT_FormComponent,
    ExpertReview_8_10PVT_FormComponent,
    ExpertReview_8_11_14_FormComponent,
    ExpertReview_8_12IP_FormComponent,
    ExpertReview_8_12NIOKTR_FormComponent,
    ExpertReview_8_13_FormComponent,
    ExpertReview_8_15_FormComponent,
    ExpertReview_8_16_FormComponent,
    ExpertReview_8_8EAC_FormComponent,
    ExpertReview_8_8BIF_FormComponent,
    Agenda_8_1_FormComponent,
    Agenda_8_15_FormComponent,
    Agenda_8_9_FormComponent,
    Agenda_8_12IP_FormComponent,
    Agenda_8_12IP_2025FormComponent,
    Agenda_8_10PIT_FormComponent,
    Agenda_8_10PVT_FormComponent,
    Agenda_8_13_FormComponent,
    Agenda_8_6_FormComponent,
    DecisionDocumentFormComponent,
    ReferralFormComponent,
    MeetingProtocolFormComponent,
    VoteResultsComponent,
    CouncilConclusionFormContainerComponent,
    FinanceConclusionBlock2025Component,
    TargetAccordanceBlock2025Component,
    NoveltyBlockComponent,
    CompetitivenessBlock2025Component,
    CompetitivenessBlockAgenda2025Component,
    AnalogBlock2025Component,
    TermsAccordanceBlock2025Component,
    AnalogParamsBlock2025Component,
    NeedsBlock2025Component,
    NameAccordanceBlock2025Component,
    NoveltyBlock2025Component,
    EconomicSignificanceBlockComponent,
    EconomicSignificance88BIFBlockComponent,
    ResourcesSufficiencyBlockComponent,
    TaskListsBlock2025Component,
    TechnologicalOrderBlock2025Component,
    TargetBlock2025Component,
    ResourcesSufficiencyBlock2025Component,
    ScientificResearchBlock2025Component,
    CompetenceSufficiencyBlockComponent,
    CompetenceSufficiencyBlock2025Component,
    MarketingResearchBlockComponent,
    MarketingResearchBlock2025Component,
    RisksBlockComponent,
    RisksBlock2025Component,
    PrivacyBlockComponent,
    PrivacyBlock2025Component,
    StagesExistsBlockComponent,
    StagesExistsBlock2025Component,
    SocialOrSecurityBlock2025Component,
    EconomicActivityBlockComponent,
    BasedOnHighTechBlockComponent,
    ImportOrientationBlockComponent,
    NameAccordanceBlockComponent,
    TermsAccordanceBlockComponent,
    FinanceAccordanceBlockComponent,
    FinanceAccordanceBlock2025Component,
    SoftwareToolBlock2025Component,
    FinanceConclusionBlockComponent,
    ConclusionBlockComponent,
    NotesBlockComponent,
    TargetBlockComponent,
    ExpertReview_8_3_4_12NIOKTR_NewFormComponent,
    CompetitivenessBlockComponent,
    AnalogBlockComponent,
    AnalogParamsBlockComponent,
    NeedsBlockComponent,
    TargetAccordanceBlockComponent,
    ExpertReview_8_5_7_8_12IP_NewFormComponent,
    ScientificLevelBlockComponent,
    ScientificLevelBlock2025Component,
    NoveltyExistsBlockComponent,
    NoveltyExistsBlock2025Component,
    TechnologyTypeBlockComponent,
    TechnologyTypeBlock2025Component,
    DocumentAccordanceBlock,
    SectionBlockComponent,
    SectionBlock2025Component,
    AddedValueBlockComponent,
    AddedValueBlock2025Component,
    AddedValueInBoundBlockComponent,
    AddedValueInBoundBlock2025Component,
    BalanceBlockComponent,
    BalanceBlock2025Component,
    ExportBlockComponent,
    ExportBlock2025Component,
    ExportBalanceBlockComponent,
    ConsequencesBlockComponent,
    ConsequencesBlock2025Component,
    MarketingResearchPlainBlockComponent,
    MarketingResearchPlainBifBlockComponent,
    MarketingResearchResultsBlockComponent,
    MarketingResearchResultsBlock2025Component,
    ScientificLevelItemsBlockComponent,
    ScientificLevelOfInjectedTechBlockComponent,
    AnalogDescriptionBlockComponent,
    FinanceAccordanceConclusionBlockComponent,
    AnalogParamsDescriptionBlockComponent,
    ResultsBlockComponent,
    ExpertReview_8_6_NewFormComponent,
    EffectivenessBlockComponent,
    ResultAccordanceBlockComponent,
    EffectAccordanceBlockComponent,
    EconomicSignificanceBlock2025Component,
    CommerceBlock2025Component,
    Conclusion_8_6_BlockComponent,
    EconomicSignificance_8_8_BlockComponent,
    ExportOrientedBlockComponent,
    ExpertReview_8_9_NewFormComponent,
    ScientificLevelExBlockComponent,
    PriorityAccordanceBlockComponent,
    TechnologyBlockComponent,
    Conclusion_8_9_BlockComponent,
    ExpertReview_8_10PVT_NewFormComponent,
    ExpertReview_8_10PIT_NewFormComponent,
    ProductNameBlockComponent,
    PvtProductNamingBlockComponent,
    PvtAgendaCofTechBlockComponent,
    PatentsBlockComponent,
    AdvantageBlockComponent,
    ProductCompetitivenessBlockComponent,
    Conclusion810PITBlockComponent,
    ExpertReview_8_11_14_NewFormComponent,
    SignificanceBlockComponent,
    EffectBlockComponent,
    SufficiencyBlockComponent,
    UsersBlockComponent,
    CharacteristicsBlockComponent,
    WorkAccordanceBlockComponent,
    RequirementsBlockComponent,
    AssessmentBlockComponent,
    Conclusion_8_11_14_BlockComponent,
    ExpertReview_8_13_NewFormComponent,
    ProgramRequirementsBlockComponent,
    PrognosisBlockComponent,
    TargetAnalysisBlockComponent,
    ProgramSufficiencyBlockComponent,
    Conclusion_8_13_BlockComponent,
    Conclusion_8_16_BlockComponent,
    SelectDirectionsAndGoalsBlockComponent,
    SelectDirectionsAndGoalsBlock2025Component,
    Agenda_8_1_2_NewFormComponent,
    RbNeedsBlockComponent,
    RbNeedsBlock2025Component,
    StagesBlockComponent,
    StagesBlock2025Component,
    PercentageOfImportToExportBlockComponent,
    NewVoteResultsComponent,
    ConclusionSectionBlockComponent,
    Agenda_8_3_4_5_7_8_11_12NIOKTR_NewFormComponent,
    Agenda_8_1_2_3_4_5_7_8_12NIOKTR_14_2025_FormComponent,
    Agenda_8_8_Bif_Eac_FormComponent,
    AgendaHeaderBlockComponent,
    CustomerRepliesBlockComponent,
    Agenda_8_14_NewFormComponent,
    Agenda_8_6_NewFormComponent,
    AssessmentConclusionBlockComponent,
    AssessmentConclusionBlock2025Component,
    Agenda_8_9_NewFormComponent,
    ScientificLevelConclusionBlockComponent,
    PriorityAccordanceConclusionBlockComponent,
    ConsequencesConclusionBlockComponent,
    HighTechBlockComponent,
    Agenda_8_10PVT_NewFormComponent,
    Agenda_8_10PIT_NewFormComponent,
    InnovativeBlockComponent,
    Agenda_8_12IP_NewFormComponent,
    Agenda_8_13_NewFormComponent,
    ProgramLevelBlockComponent,
    ProgramSufficiencyFinanceBlockComponent,
    Agenda_8_15_NewFormComponent,
    Agenda_8_15_2025FormComponent,
    Agenda_8_16_NewFormComponent,
    CouncilConclusion_8_1_2_FormComponent,
    ConclusionCouncilBlockComponent,
    CouncilConclusion_8_3_4_5_7_8_12_15_FormComponent,
    CouncilConclusion_8_9_FormComponent,
    CouncilConclusion_8_10PVT_FormComponent,
    HighTechAccordanceBlockComponent,
    NoveltyAccordanceBlockComponent,
    WastelessnessBlockComponent,
    ExportOrientatedBlockComponent,
    ScienceBlockComponent,
    AddedValueAccordanceBlockComponent,
    IntellectualPropertyBlockComponent,
    IntellectualLaborBlockComponent,
    CouncilConclusion_8_10PIT_FormComponent,
    PatentsAccordanceBlockComponent,
    AdvantageAccordanceBlockComponent,
    CompetitivenessAccordanceBlockComponent,
    CouncilConclusion_8_11_14_FormComponent,
    WorkSignificanceBlockComponent,
    CreationIndustrialExpertiseBlock,
    EffectConclusionBlockComponent,
    CouncilConclusion_8_16_FormComponent,
    CouncilConclusion_8_8BIF_FormComponent,
    CouncilConclusion_8_13_FormComponent,
    CouncilConclusion_8_6_FormComponent,
    ReturnFromCouncilWithoutExpertiseFormComponent,
    ConstructionWorkBlockComponent,
    ConstructionWorkBlock2025Component,
    CorrespondenceOfProductNameComponent,
    NewAndHighTechComponent,
    PercentageOfExportToImportBlockComponent,
    ProjectDocsBlockComponent,
    ProjectDocsBlock2025Component,
    NeededProjectDocsBlockComponent,
    NeededProjectDocsBlock2025Component,
    TitleProtectionBlockComponent,
    ExportOrientationBlockComponent,
    CofTechBlockComponent,
    CatalogHighTechBlockComponent,
    ConclusionCouncilHightechBlockComponent,
    ExpertReview_8_1_2_15_2025FormComponent,
    ExpertReview_8_3_4_12NIOKTR_2025FormComponent,
    ExpertReview_8_5_7_8_12IP_2025FormComponent,
    ExpertReview_8_14_2025FormComponent,
    SignificanceBlock2025Component,
    EffectBlock2025Component,
    SufficiencyBlock2025Component,
    UsersBlock2025Component,
    CharacteristicsBlock2025Component,
    WorkAccordanceBlock2025Component,
    RequirementsBlock2025Component,
    Conclusion_8_14_BlockComponent,
    ExpertReview_8_13_2025FormComponent,
    SocioEconomivDev2025Component,
    ProgramRequirementsBlock2025Component,
    PrognosisBlock2025Component,
    TargetAnalysisBlock2025Component,
    ProgramSufficiencyBlock2025Component,
    Conclusion_8_13_Block2025Component,
    AvailabilityOfDocumentsBlock2025Component,
    CouncilConclusion_8_14_2025_FormComponent,
    DeadlinesComplianceBlockComponent
  ],
  providers: [
    ExpertReviewFormResolver,
    AgendaFormResolver,
    CouncilConclusionFormResolver,
  ],
  exports: [
    DocumentFormContainerComponent,
    ExpertReviewFormContainerComponent,
    DecisionDocumentFormComponent,
    ReferralFormComponent,
    MeetingProtocolFormComponent,
    CouncilConclusionFormContainerComponent,
    ReturnFromCouncilWithoutExpertiseFormComponent,
  ]
})
export class DocumentFormModule {
}
