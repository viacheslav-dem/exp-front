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
    // Инкрементальная миграция: required/minlength/maxlength реализованы через template-driven validators в блоках,
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
    this.validationConclusionAnalysisAndEvaluation();
    // Бизнес-валидация: проверка суммы финансирования
    if (this.formValue().financeSuggestion < 0) {
      throw 'Предложенная сумма финансирования не может быть меньше нуля.'
    }
  }

  private validationConclusionAnalysisAndEvaluation() {
    const f = this.formValue();
    if (isEmptyOrNull(f.novelty)) {
      throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' не выстановленно заключение."
    }
    if (isEmptyOrNull(f.economicSignificance)) {
      throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' не выстановленно заключение.";
    }
    if (isEmptyOrNull(f.section?.code)) {
      throw "В пункте 'Секция и подсекция основного вида экономической деятельности, " +
      "которому соответствует планируемый к реализации инновационный проект.' не выстановленно заключение.";
    }
    if (isEmptyOrNull(f.resourcesSufficiency)) {
      throw "В пункте 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' не выстановленно заключение.";
    }
    if (isEmptyOrNull(f.competenceSufficiency)) {
      throw "В пункте 'Достаточность компетенции кадрового состава потенциального исполнителя работ' не выстановленно заключение.";
    }
    if (isEmptyOrNull(f.marketingResearch)) {
      throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' не выстановленно заключение.";
    }
    if (isEmptyOrNull(f.risks)) {
      throw "В пункте 'Риски реализации проекта.' не выстановленно заключение.";
    }
    if (isEmptyOrNull(f.privacyObjectsDescription)) {
      throw "В пункте 'Создание объекта права промышленной собственности при реализации объекта государственной экспертизы.' не выстановленно заключение."
    }
  }

  createNewForm(): ExpertReview_8_5_7_8_12IP_2025FormContent {
    return new ExpertReview_8_5_7_8_12IP_2025FormContent();
  }

  isFinanceConclusionDisabled() {
    const f = this.formValue();
    return !anyMatch(f.novelty, 'новый для Республики Беларусь', 'новый для стран СНГ', 'новизна мирового уровня')
        || !anyMatch(f.economicSignificance, 'средняя', 'высокая');
  }

  isConclusionDisabled() {
    return !this.formValue().financeConclusion;
  }

  onConditionsChanged() {
    if (this.isFinanceConclusionDisabled()) {
      this.patchForm({ financeConclusion: false });
    }
    if (this.isConclusionDisabled()) {
      this.patchForm({ conclusion: false });
    }
  }

  override setForm(form: ExpertReview_8_5_7_8_12IP_2025FormContent) {
    super.setForm(form);
    this.updateForm(f => ({
      ...f,
      termsSuggestion: f.termsSuggestion || new PeriodDto(),
      scientificLevelItems: f.scientificLevelItems || [],
    }));
  }
}
