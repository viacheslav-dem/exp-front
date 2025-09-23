import { Component, OnInit } from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {isEmptyOrNull} from "@app/support/utils";
import {
  ExpertReview_8_13_2025FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_13_2025FormContent";

@Component({
  selector: 'app-review-8-13-2025-form',
  templateUrl: './expert-review_8_13_2025-form.component.html'
})
export class ExpertReview_8_13_2025FormComponent extends ExpertReviewForm<ExpertReview_8_13_2025FormContent> {

  isConclusionDisabled() {
    let disabled = !this._form.priorityAreas
        && !this._form.programRequirements
        && !this._form.prognosis
        && !this._form.targetAnalysis
        && !this._form.programSufficiency
       // || this._form.selectedDirections.length + this._form.selectedSocialEconomicGoals.length == 0;
    if (disabled) {
      this._form.conclusion = false;
    }
    console.log(disabled);
    return disabled;
  }

  validate() {
    super.validate();
    this.validationCommentsOnConclusionAnalysisAndEvaluation();
    this.validationLengthCommentsOnConclusionAnalysisAndEvaluation()
  }

  onConditionsChanged() {
    if (this.isConclusionDisabled()) {
      this._form.conclusion = false;
    }
  }

  createNewForm(): ExpertReview_8_13_2025FormContent {
    return new ExpertReview_8_13_2025FormContent();
  }

  private validationCommentsOnConclusionAnalysisAndEvaluation() {
    if (isEmptyOrNull(this._form.priorityAreasText)) {
      throw "В пункте 'Соответствие приоритетным направлениям научной, научно-технической и инновационной деятельности в Республике Беларусь.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.programRequirementsText)) {
      throw "В пункте '2. Соответствие требованиям, указанным в Положении о порядке формирования, финансирования, выполнения и оценки эффективности реализации государственных программ.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.prognosisText)) {
      throw "В пункте '3. Оценка анализа текущего состояния и прогноза научно-технического развития соответствующей сферы планирования.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.targetAnalysisText)) {
      throw "В пункте '4. Анализ целевых показателей:' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.programSufficiencyText)) {
      throw "В пункте '5. Достаточность перечня мероприятий по научному обеспечению государственной программы / перечня заданий государственной научно-технической программы для достижения запланированных программой целевых показателей:' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.conclusionText)) {
      throw "В пункте 'Заключение эксперта по объекту государственной экспертизы.' нет комментария к заключению."
    }
  }

  private validationLengthCommentsOnConclusionAnalysisAndEvaluation() {
    if (this._form.priorityAreasText.length < 30) {
      throw "В пункте 'Соответствие приоритетным направлениям научной, научно-технической и инновационной деятельности в Республике Беларусь.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.programRequirementsText.length < 30) {
      throw "В пункте '2. Соответствие требованиям, указанным в Положении о порядке формирования, финансирования, выполнения и оценки эффективности реализации государственных программ' комментарий должен быть не менее 30 символов."
    }
    if (this._form.prognosisText.length < 30) {
      throw "В пункте '3. Оценка анализа текущего состояния и прогноза научно-технического развития соответствующей сферы планирования.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.targetAnalysisText.length < 30) {
      throw "В пункте '4. Анализ целевых показателей:' комментарий должен быть не менее 30 символов."
    }
    if (this._form.programSufficiencyText.length < 30) {
      throw "В пункте '5. Достаточность перечня мероприятий по научному обеспечению государственной программы / перечня заданий государственной научно-технической программы для достижения запланированных программой целевых показателей:' комментарий должен быть не менее 30 символов."
    }
    if (this._form.conclusionText.length < 30) {
      throw "В пункте 'Заключение эксперта по объекту государственной экспертизы.' комментарий должен быть не менее 30 символов."
    }
  }
}

