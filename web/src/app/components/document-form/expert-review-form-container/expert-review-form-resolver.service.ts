import {Injectable, Type} from "@angular/core";
import {ExpertReview_8_3_4_5_7_8_FormComponent} from "app/components/document-form/expert-review-8-3-4-5-7-8-form/expert-review-8-3-4-5-7-8-form.component";
import {ExpertReview_8_1_FormComponent} from "app/components/document-form/expert-review-8-1-form/expert-review-8-1-form.component";
import {ExpertReview_8_2_FormComponent} from "app/components/document-form/expert-review-8-2-form/expert-review-8-2-form.component";
import {ExpertReview_8_11_14_FormComponent} from "app/components/document-form/expert-review-8-11-14-form/expert-review-8-11-14-form.component";
import {ExpertReview_8_12NIOKTR_FormComponent} from "app/components/document-form/expert-review-8-12NIOKTR-form/expert-review-8-12NIOKTR-form.component";
import {ExpertReview_8_6_FormComponent} from "app/components/document-form/expert-review-8-6-form/expert-review-8-6-form.component";
import {ExpertReview_8_9_FormComponent} from "app/components/document-form/expert-review-8-9-form/expert-review-8-9-form.component";
import {ExpertReview_8_10PIT_FormComponent} from "app/components/document-form/expert-review-8-10PIT-form/expert-review-8-10PIT-form.component";
import {ExpertReview_8_13_FormComponent} from "app/components/document-form/expert-review-8-13-form/expert-review-8-13-form.component";
import {ExpertReview_8_15_FormComponent} from "app/components/document-form/expert-review-8-15-form/expert-review-8-15-form.component";
import {ExpertReview_8_10PVT_FormComponent} from "app/components/document-form/expert-review-8-10PVT-form/expert-review-8-10PVT-form.component";
import {ExpertReview_8_12IP_FormComponent} from "app/components/document-form/expert-review-8-12IP-form/expert-review-8-12IP-form.component";
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {ExpertReview_8_1_2_15_NewFormComponent} from "@app/components/document-form/expert-review-8-1-2-15-new-form/expert-review-8-1-2-15-new-form.component";
import {ExpertReview_8_3_4_12NIOKTR_NewFormComponent} from "@app/components/document-form/expert-review-8-3-4-12NIOKTR-new-form/expert-review-8-3-4-12NIOKTR-new-form.component";
import {ExpertReview_8_5_7_8_12IP_NewFormComponent} from "@app/components/document-form/expert-review-8-5-7-8-12IP-new-form/expert-review-8-5-7-8-12IP-new-form.component";
import {ExpertReview_8_6_NewFormComponent} from "@app/components/document-form/expert-review-8-6-new-form/expert-review-8-6-new-form.component";
import {ExpertReview_8_9_NewFormComponent} from "@app/components/document-form/expert-review-8-9-new-form/expert-review-8-9-new-form.component";
import {ExpertReview_8_10PVT_NewFormComponent} from "@app/components/document-form/expert-review-8-10PVT-new-form/expert-review-8-10PVT-form.component";
import {TemplateType} from "@app/components/document-form/form-model/TemplateType";
import {ExpertReview_8_10PIT_NewFormComponent} from "@app/components/document-form/expert-review-8-10PIT-new-form/expert-review-8-10PIT-new-form.component";
import {ExpertReview_8_11_14_NewFormComponent} from "@app/components/document-form/expert-review-8-11-14-new-form/expert-review-8-11-14-new-form.component";
import {ExpertReview_8_13_NewFormComponent} from "@app/components/document-form/expert-review-8-13-new-form/expert-review-8-13-new-form.component";
import {
  ExpertReview_8_16_FormComponent
} from "@app/components/document-form/expert-review-8-16-form/expert-review-8-16-form.component";
import {
  ExpertReview_8_8EAC_FormComponent
} from "@app/components/document-form/expert-review-8-8EAC-form/expert-review-8-8EAC-form-componen";
import {
  ExpertReview_8_8BIF_FormComponent
} from "@app/components/document-form/expert-review-8-8BIF-form/expert-review-8-8BIF-form-component";

export class ExpertReviewFormResolver {

  private formRenderers: any = {
    [TemplateType.EXPERT_REVIEW_8_1]: ExpertReview_8_1_FormComponent,
    [TemplateType.EXPERT_REVIEW_8_1_2_15_NEW]: ExpertReview_8_1_2_15_NewFormComponent,
    [TemplateType.EXPERT_REVIEW_8_3_4_12NIOKTR_NEW]: ExpertReview_8_3_4_12NIOKTR_NewFormComponent,
    [TemplateType.EXPERT_REVIEW_8_5_7_8_12IP_NEW]: ExpertReview_8_5_7_8_12IP_NewFormComponent,
    [TemplateType.EXPERT_REVIEW_8_6_NEW]: ExpertReview_8_6_NewFormComponent,
    [TemplateType.EXPERT_REVIEW_8_9_NEW]: ExpertReview_8_9_NewFormComponent,
    [TemplateType.EXPERT_REVIEW_8_10PVT_NEW]: ExpertReview_8_10PVT_NewFormComponent,
    [TemplateType.EXPERT_REVIEW_8_10PIT_NEW]: ExpertReview_8_10PIT_NewFormComponent,
    [TemplateType.EXPERT_REVIEW_8_11_14_NEW]: ExpertReview_8_11_14_NewFormComponent,
    [TemplateType.EXPERT_REVIEW_8_13_NEW]: ExpertReview_8_13_NewFormComponent,
    [TemplateType.EXPERT_REVIEW_8_2]: ExpertReview_8_2_FormComponent,
    [TemplateType.EXPERT_REVIEW_8_3_4_5_7_8]: ExpertReview_8_3_4_5_7_8_FormComponent,
    [TemplateType.EXPERT_REVIEW_8_6]: ExpertReview_8_6_FormComponent,
    [TemplateType.EXPERT_REVIEW_8_9]: ExpertReview_8_9_FormComponent,
    [TemplateType.EXPERT_REVIEW_8_10PIT]: ExpertReview_8_10PIT_FormComponent,
    [TemplateType.EXPERT_REVIEW_8_10PVT]: ExpertReview_8_10PVT_FormComponent,
    [TemplateType.EXPERT_REVIEW_8_11_14]: ExpertReview_8_11_14_FormComponent,
    [TemplateType.EXPERT_REVIEW_8_12_IP]: ExpertReview_8_12IP_FormComponent,
    [TemplateType.EXPERT_REVIEW_8_12_NIOKTR]: ExpertReview_8_12NIOKTR_FormComponent,
    [TemplateType.EXPERT_REVIEW_8_13]: ExpertReview_8_13_FormComponent,
    [TemplateType.EXPERT_REVIEW_8_15]: ExpertReview_8_15_FormComponent,
    [TemplateType.EXPERT_REVIEW_8_16]: ExpertReview_8_16_FormComponent,
    [TemplateType.EXPERT_REVIEW_8_8EAC]: ExpertReview_8_8EAC_FormComponent,
    [TemplateType.EXPERT_REVIEW_8_8BIF]: ExpertReview_8_8BIF_FormComponent,
  };

  constructor() {
  }

  /**
   * Usage example: <tt>resolver.getFormRenderer(TemplateType.EXPERT_REVIEW_8_3_4_5_7_8)</tt>
   * @param {string} templateType
   */
  getFormRenderer(templateType: TemplateType): Type<ExpertReviewForm<any>> {
    return this.formRenderers[templateType];
  }
}
