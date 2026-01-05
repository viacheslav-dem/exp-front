import { Component, OnInit } from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {
  ExpertReview_8_5_7_8_12IP_NewFormContent
} from "@app/components/document-form/form-model/ExpertReview_8_5_7_8_12IP_NewFormContent";
import {anyMatch, isEmptyOrNull} from "@app/support/utils";
import {PeriodDto} from "@app/dto/PeriodDto";
import {
  ExpertReview_8_5_7_8_12IP_2025FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_5_7_8_12IP_2025FormContent";

@Component({
  selector: 'app-expert-review-8-5-7-8-12IP-2025-form',
  templateUrl: './expert-review_8_5_7_8_12-i-p_2025-form.component.html',
  standalone: false
})
export class ExpertReview_8_5_7_8_12IP_2025FormComponent extends ExpertReviewForm<ExpertReview_8_5_7_8_12IP_2025FormContent> {

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
    if (this._form.nameAccordanceText.length < 30 || this._form.nameAccordanceText.length > 5000) {
      throw "В пункте 'Соответствие объекта государственной экспертизы своему наименованию.' комментарий должен быть не менее 30 символов и не более 5000 символов."
    }
    if (this._form.termsAccordanceText.length < 30 || this._form.termsAccordanceText.length > 5000) {
      throw "В пункте 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' комментарий должен быть не менее 30 символов и не более 5000 символов."
    }
    if (this._form.financeAccordanceText.length < 30 || this._form.financeAccordanceText.length > 5000) {
      throw "В пункте 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' комментарий должен быть не менее 30 символов и не более 5000 символов."
    }
    if (this._form.financeConclusionText.length < 30 || this._form.financeConclusionText.length > 5000) {
      throw "В пункте 'Целесообразность реализации объекта государственной экспертизы и его финансирования за счет средств республиканского бюджета и (или) других источников финансирования.' комментарий должен быть не менее 30 символов и не более 5000 символов."
    }
    if (this._form.targetAccordanceText.length < 30 || this._form.targetAccordanceText.length > 5000) {
      throw "В пункте 'Соответствие объекта государственной экспертизы заявленным целям.' комментарий должен быть не менее 30 символов и не более 5000 символов."
    }
  }

  private validationCommentsOnConclusionRelusAndResult() {
    if (isEmptyOrNull(this._form.nameAccordanceText)) {
      throw "В пункте 'Соответствие объекта государственной экспертизы своему наименованию.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.termsAccordanceText)) {
      throw "В пункте 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.financeAccordanceText)) {
      throw "В пункте 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.financeConclusionText)) {
      throw "В пункте 'Целесообразность реализации объекта государственной экспертизы и его финансирования за счет средств республиканского бюджета и (или) других источников финансирования.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.targetAccordanceText)) {
      throw "В пункте 'Соответствие объекта государственной экспертизы заявленным целям.' нет комментария к заключению."
    }
  }

  private validationLengthCommentsOnConclusionAnalysisAndEvaluation() {
    if (this._form.priorityAreasText.length < 30 || this._form.priorityAreasText.length > 5000) {
      throw "В пункте 'Соответствие приоритетным направлениям научной, научно-технической и инновационной деятельности в Республике Беларусь.' комментарий должен быть не менее 30 символов и не более 5000 символов."
    }
    if (this._form.noveltyText.length < 30 || this._form.noveltyText.length > 5000) {
      throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' комментарий должен быть не менее 30 символов и не более 5000 символов."
    }
    if (this._form.economicSignificanceText.length < 30 || this._form.economicSignificanceText.length > 5000) {
      throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' комментарий должен быть не менее 30 символов и не более 5000 символов."
    }
    if (this._form.sectionText.length < 30 || this._form.sectionText.length > 5000) {
      throw "В пункте 'Секция и подсекция основного вида экономической деятельности, " +
      "которому соответствует планируемый к реализации инновационный проект.' комментарий должен быть не менее 30 символов и не более 5000 символов."
    }
    if (this._form.resourcesSufficiencyText.length < 30 || this._form.resourcesSufficiencyText.length > 5000) {
      throw "В пункте 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' комментарий должен быть не менее 30 символов и не более 5000 символов."
    }
    if (this._form.competenceSufficiencyText.length < 30 || this._form.competenceSufficiencyText.length > 5000) {
      throw "В пункте 'Достаточность компетенции кадрового состава потенциального исполнителя работ' комментарий должен быть не менее 30 символов и не более 5000 символов."
    }
    if (this._form.marketingResearchText.length < 30 || this._form.marketingResearchText.length > 5000) {
      throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' комментарий должен быть не менее 30 символов и не более 5000 символов."
    }
    if (this._form.risksText.length < 30 || this._form.risksText.length > 5000) {
      throw "В пункте 'Риски реализации проекта.' комментарий должен быть не менее 30 символов и не более 5000 символов."
    }
    if (this._form.privacyObjectsDescriptionText.length < 30 || this._form.privacyObjectsDescriptionText.length > 5000) {
      throw "В пункте 'Создание объекта права промышленной собственности при реализации объекта государственной экспертизы.' комментарий должен быть не менее 30 символов и не более 5000 символов."
    }
  }

  private validationCommentsOnConclusionAnalysisAndEvaluation() {
    if (isEmptyOrNull(this._form.priorityAreasText)) {
      throw "В пункте 'Соответствие приоритетным направлениям научной, научно-технической и инновационной деятельности в Республике Беларусь.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.noveltyText)) {
      throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.scientificLevel)) {
      throw "В пункте 'Оценка научно-технического уровня внедряемых технологий по сравнению с передовыми технологиями, " +
      "используемыми в мире, и возможности их применения на соответствующем производстве..' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.noveltyExistsText)) {
      throw "В пункте 'Создание и внедрение новых технологий и (или) производство новой для Республики Беларусь " +
      "и (или) мировой экономики продукции' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.technologyTypeText)) {
      throw "В пункте 'Использование технологий V или VI технологических укладов' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.economicSignificanceText)) {
      throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.sectionText)) {
      throw "В пункте 'Секция и подсекция основного вида экономической деятельности, " +
      "которому соответствует планируемый к реализации инновационный проект.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.addedValueText)) {
      throw "В пункте 'Уровень добавленной стоимости на одного работающего по инновационному проекту, " +
      "соответствующий году, следующему за годом выхода на проектную мощность.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.balanceText)) {
      throw "В пункте 'Сальдо потока денежных средств в свободно-конвертируемой валюте от текущей (операционной) деятельности.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.consequences)) {
      throw "В пункте 'Оценка возможных социальных, экономических и экологических последствий внедрения выбранных технологий " +
      "и необходимости модернизации (реконструкции) взаимосвязанных действующих производственных объектов.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.constructionWorksText)) {
      throw "В пункте 'Необходимость осуществления работ в сфере строительной деятельности. Возведение, " +
      "реконструкция, реставрация, капитальный ремонт, техническая модернизация зданий и сооружений, их благоустройство.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.projectDocsText)) {
      throw "В пункте 'Наличие проектной (предпроектной) документации.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.neededProjectDocsText)) {
      throw "В пункте 'Разработка проектной (предпроектной) документации.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.resourcesSufficiencyText)) {
      throw "В пункте 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.competenceSufficiencyText)) {
      throw "В пункте 'Достаточность компетенции кадрового состава потенциального исполнителя работ' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.marketingResearchText)) {
      throw "В пункте 'Сведения о проведении маркетинговых и патентных исследований и их результаты.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.risksText)) {
      throw "В пункте 'Риски реализации проекта.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.privacyObjectsDescriptionText)) {
      throw "В пункте 'Создание объекта права промышленной собственности при реализации объекта государственной экспертизы.' нет комментария к заключению."
    }
  }

  private validationConclusionAnalysisAndEvaluation() {
    if (isEmptyOrNull(this._form.novelty)) {
      throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.economicSignificance)) {
      throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' не выстановленно заключение.";
    }
    if (isEmptyOrNull(this._form.section.code)) {
      throw "В пункте 'Секция и подсекция основного вида экономической деятельности, " +
      "которому соответствует планируемый к реализации инновационный проект.' не выстановленно заключение.";
    }
    if (isEmptyOrNull(this._form.resourcesSufficiency)) {
      throw "В пункте 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' не выстановленно заключение.";
    }
    if (isEmptyOrNull(this._form.competenceSufficiency)) {
      throw "В пункте 'Достаточность компетенции кадрового состава потенциального исполнителя работ' не выстановленно заключение.";
    }
    if (isEmptyOrNull(this._form.marketingResearch)) {
      throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' не выстановленно заключение.";
    }
    if (isEmptyOrNull(this._form.risks)) {
      throw "В пункте 'Риски реализации проекта.' не выстановленно заключение.";
    }
    if (isEmptyOrNull(this._form.privacyObjectsDescription)) {
      throw "В пункте 'Создание объекта права промышленной собственности при реализации объекта государственной экспертизы.' не выстановленно заключение."
    }
  }

  createNewForm(): ExpertReview_8_5_7_8_12IP_2025FormContent {
    return new ExpertReview_8_5_7_8_12IP_2025FormContent();
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

  setForm(form: ExpertReview_8_5_7_8_12IP_2025FormContent) {
    super.setForm(form);
    this._form.termsSuggestion = this._form.termsSuggestion || new PeriodDto();
    this._form.scientificLevelItems = this._form.scientificLevelItems || [];
  }
}
