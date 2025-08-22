import { Component, OnInit } from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {
  ExpertReview_8_11_14_NewFormContent
} from "@app/components/document-form/form-model/ExpertReview_8_11_14_NewFormContent";
import {isEmptyOrNull} from "@app/support/utils";
import {
  ExpertReview_8_14_2025FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_14_2025FormContent";

@Component({
  selector: 'app-expert-review_8_14_2025-form',
  templateUrl: './expert-review_8_14_2025-form.component.html'
})
export class ExpertReview_8_14_2025FormComponent extends ExpertReviewForm<ExpertReview_8_14_2025FormContent> {

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.significance)
        || isEmptyOrNull(this._form.marketingResearch)
        || isEmptyOrNull(this._form.effect)
        || isEmptyOrNull(this._form.users)
        || isEmptyOrNull(this._form.characteristics)
        || isEmptyOrNull(this._form.assessment)
        || isEmptyOrNull(this._form.stagesExist)
        || isEmptyOrNull(this._form.privacyObjectsDescription)
        || isEmptyOrNull(this._form.marketingResearchText)
        || isEmptyOrNull(this._form.sufficiencyText)
        || isEmptyOrNull(this._form.workAccordanceText)
        || isEmptyOrNull(this._form.requirementsText)
        || isEmptyOrNull(this._form.privacyObjectsDescriptionText)
        || isEmptyOrNull(this._form.conclusionText)
        || isEmptyOrNull(this._form.stagesExistText)
    ) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }

    if (this._form.marketingResearchText.length < 30
        || this._form.sufficiencyText.length < 30
        || this._form.workAccordanceText.length < 30
        || this._form.requirementsText.length < 30
        || this._form.privacyObjectsDescriptionText.length < 30
        || this._form.conclusionText.length < 30
        || this._form.stagesExistText.length < 30) {
      throw 'Длина сообщения меньше 30 символов';
    }
  }

  createNewForm(): ExpertReview_8_14_2025FormContent {
    return new ExpertReview_8_14_2025FormContent();
  }

  onConditionsChanged() {
  }
}