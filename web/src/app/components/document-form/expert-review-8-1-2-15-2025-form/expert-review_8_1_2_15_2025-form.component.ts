import { Component, OnInit } from '@angular/core';
import {anyMatch, isEmptyOrNull} from "@app/support/utils";
import {
  ExpertReview_8_1_2_15_NewFormContent
} from "@app/components/document-form/form-model/ExpertReview_8_1_2_15_NewFormContent";
import {PeriodDto} from "@app/dto/PeriodDto";
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {
  ExpertReview_8_1_2_15_2025FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_1_2_15_2025FormContent";

@Component({
  selector: 'app-expert-review-8-1-2-15-2025-form',
  templateUrl: './expert-review_8_1_2_15_2025-form.component.html'
})
export class ExpertReview_8_1_2_15_2025FormComponent extends ExpertReviewForm<ExpertReview_8_1_2_15_2025FormContent> {
  validate() {
    super.validate();
    this.validationConclusionAnalysisAndEvaluation();
    this.validationCommentsOnConclusionAnalysisAndEvaluation();
    this.validationLengthCommentsOnConclusionAnalysisAndEvaluation()
    this.validationCommentsOnConclusionRelusAndResult();
    this.validationLengthCommentsOnConclusionRelusAndResult();

    if (this._form.financeSuggestion < 0) {
      throw 'Предложенная сумма финансирования не может быть меньше нуля.'
    }

  }

  private validationLengthCommentsOnConclusionRelusAndResult() {
    if (this._form.nameAccordanceText.length < 30) {
      throw "В пункте 'Соответствие объекта государственной экспертизы своему наименованию.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.termsAccordanceText.length < 30) {
      throw "В пункте 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.socialOrSecurityText.length < 30) {
      throw "В пункте 'Объект государственной экспертизы является социально значимым или " +
      "направленным на обеспечение национальной безопасности.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.financeAccordanceText.length < 30) {
      throw "Соответствие заявленного финансирования планируемому объему выполняемых работ.' комментарий должен быть не менее 30 символов."
    }
    // if (this._form.softwareToolText.length < 30) {
    //   throw "В пункте 'Соответствие заявленному программному инструменту реализации.' комментарий должен быть не менее 30 символов."
    // }
    if (this._form.financeConclusionText.length < 30) {
      throw "В пункте 'Целесообразность реализации объекта государственной экспертизы и его " +
      "финансирования за счет средств республиканского бюджета и (или) других источников финансирования.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.conclusionText.length < 30) {
      throw "В пункте 'Заключение эксперта по объекту государственной экспертизы.' нет комментария к заключению."
    }
  }

  private validationCommentsOnConclusionRelusAndResult() {
    if (isEmptyOrNull(this._form.nameAccordanceText)) {
      throw "В пункте 'Соответствие объекта государственной экспертизы своему наименованию.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.termsAccordanceText)) {
      throw "В пункте 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.socialOrSecurityText)) {
      throw "В пункте 'Объект государственной экспертизы является социально значимым или " +
      "направленным на обеспечение национальной безопасности.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.financeAccordanceText)) {
      throw "Соответствие заявленного финансирования планируемому объему выполняемых работ.' нет комментария к заключению."
    }
    // if (isEmptyOrNull(this._form.softwareToolText)) {
    //   throw "В пункте 'Соответствие заявленному программному инструменту реализации.' нет комментария к заключению."
    // }
    if (isEmptyOrNull(this._form.financeConclusionText)) {
      throw "В пункте 'Целесообразность реализации объекта государственной экспертизы и его " +
      "финансирования за счет средств республиканского бюджета и (или) других источников финансирования.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.conclusionText)) {
      throw "В пункте 'Заключение эксперта по объекту государственной экспертизы.' нет комментария к заключению."
    }
  }

  private validationLengthCommentsOnConclusionAnalysisAndEvaluation() {
    if (this._form.noveltyText.length < 30) {
      throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.economicSignificanceText.length < 30) {
      throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.commerceText.length < 30) {
      throw "В пункте 'Способ коммерциализации результата (-ов) научно-технической деятельности.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.resourcesSufficiencyText.length < 30) {
      throw "В пункте 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.competenceSufficiencyText.length < 30) {
      throw "В пункте 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.marketingResearchText.length < 30) {
      throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.risksText.length < 30) {
      throw "В пункте 'Риски реализации проекта.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.privacyObjectsDescriptionText.length < 30) {
      throw "В пункте 'Создание объекта права промышленной собственности.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.stagesExistText.length < 30) {
      throw "В пункте 'Льготирование реализации объекта государственной экспертизы. Целесообразность государственной " +
      "регистрации объекта государственной экспертизы в соответствии с законодательством Республики Беларусь.' комментарий должен быть не менее 30 символов."
    }
  }

  private validationCommentsOnConclusionAnalysisAndEvaluation() {
    if (isEmptyOrNull(this._form.noveltyText)) {
      throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.economicSignificanceText)) {
      throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.commerceText)) {
      throw "В пункте 'Способ коммерциализации результата (-ов) научно-технической деятельности.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.resourcesSufficiencyText)) {
      throw "В пункте 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.competenceSufficiencyText)) {
      throw "В пункте 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.marketingResearchText)) {
      throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.risksText)) {
      throw "В пункте 'Риски реализации проекта.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.privacyObjectsDescriptionText)) {
      throw "В пункте 'Создание объекта права промышленной собственности.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.stagesExistText)) {
      throw "В пункте 'Льготирование реализации объекта государственной экспертизы. Целесообразность государственной " +
      "регистрации объекта государственной экспертизы в соответствии с законодательством Республики Беларусь.' нет комментария к заключению."
    }
  }

  private validationConclusionAnalysisAndEvaluation() {
    if (isEmptyOrNull(this._form.novelty)) {
      throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.economicSignificance)) {
      throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.commerce)) {
      throw "В пункте 'Способ коммерциализации результата (-ов) научно-технической деятельности.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.resourcesSufficiency)) {
      throw "В пункте 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.competenceSufficiency)) {
      throw "В пункте 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.marketingResearch)) {
      throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.risks)) {
      throw "В пункте 'Риски реализации проекта.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.privacyObjectsDescription)) {
      throw "В пункте 'Создание объекта права промышленной собственности.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.stagesExist)) {
      throw "В пункте 'Льготирование реализации объекта государственной экспертизы. Целесообразность государственной " +
      "регистрации объекта государственной экспертизы в соответствии с законодательством Республики Беларусь.' не выстановленно заключение."
    }

  }



  createNewForm(): ExpertReview_8_1_2_15_2025FormContent {
    return new ExpertReview_8_1_2_15_2025FormContent();
  }

  isFinanceConclusionDisabled() {
    return !anyMatch(this._form.novelty, 'новый для Республики Беларусь', 'новый для стран СНГ', 'новизна мирового уровня')
        || !anyMatch(this._form.economicSignificance, 'средняя', 'высокая');
  }

  isConclusionDisabled() {
    return !this._form.financeConclusion;
  }

  onConditionsChanged() {
    if (this.isFinanceConclusionDisabled()) {
      this._form.financeConclusion = false;
    }
    if (this.isConclusionDisabled()) {
      this._form.conclusion = false;
    }
  }

  setForm(form: ExpertReview_8_1_2_15_2025FormContent) {
    super.setForm(form);
    this._form.termsSuggestion = this._form.termsSuggestion || new PeriodDto();
  }
}

