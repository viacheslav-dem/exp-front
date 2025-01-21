import {ExpertReviewFormContent} from "@app/components/document-form/form-model/ExpertReviewFormContent";
import {CriterionItem} from "@app/components/document-form/form-model/high-tech-criteria";

export class ExpertReview_8_10PVT_NewFormContent extends ExpertReviewFormContent {

  maxScore: number;
  analogueExists: boolean;
  productName: string;

  highTech: CriterionItem;
  science: CriterionItem;
  exportOrientation: CriterionItem;
  addedValue: CriterionItem;
  isTitleProtection: CriterionItem;
  // analogue: CriterionItem;
}
