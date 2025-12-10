import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {
  ExpertReview_8_3_4_12NIOKTR_2025FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_3_4_12NIOKTR_2025FormContent";
import {anyMatch, isEmptyOrNull} from "@app/support/utils";
import {PeriodDto} from "@app/dto/PeriodDto";
import {DataService} from "@app/services/data.service";
import {CatalogDto} from "@app/dto/CatalogDto";

@Component({
  selector: 'app-expert-review-8-3-4-12NIOKRT-2025-form',
  templateUrl: './expert-review_8_3_4_12-n-i-o-k-t-r_2025-form.component.html'
})
export class ExpertReview_8_3_4_12NIOKTR_2025FormComponent extends ExpertReviewForm<ExpertReview_8_3_4_12NIOKTR_2025FormContent> {

  noveltyOptions: string[] = [];
  private _isFormInitialized: boolean = false;

  constructor(private _dataService: DataService) {
    super();
  }

  ngOnInit() {
    this._dataService.getCommercializationMethods().subscribe(res => {
      res.forEach(option => this.noveltyOptions.push(option.name))
    })
  }

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
    if (this._form.targetAccordanceText.length < 30) {
      throw "В пункте 'Соответствие заявленному программному инструменту реализации.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.financeConclusionText.length < 30) {
      throw "В пункте 'Целесообразность реализации объекта государственной экспертизы и его " +
      "финансирования за счет средств республиканского бюджета и (или) других источников финансирования.' комментарий должен быть не менее 30 символов."
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
      throw "В пункте 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.targetAccordanceText)) {
      throw "В пункте 'Соответствие объекта государственной экспертизы заявленным целям.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.financeConclusionText)) {
      throw "В пункте 'Целесообразность реализации объекта государственной экспертизы и его " +
      "финансирования за счет средств республиканского бюджета и (или) других источников финансирования.' нет комментария к заключению."
    }
  }

  private validationLengthCommentsOnConclusionAnalysisAndEvaluation() {
    if (this._form.priorityAreasText.length < 30) {
      throw "В пункте 'Соответствие приоритетным направлениям научной, научно-технической и инновационной деятельности в Республике Беларусь.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.noveltyText.length < 30) {
      throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.scientificResearchText.length < 30) {
      throw "В пункте 'Вид научного исследования.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.economicSignificanceText.length < 30) {
      throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' комментарий должен быть не менее 30 символов."
    }
    if (this.showTarget8_3() && this._form.targetText.length < 30) {
      throw "В пункте 'Оценка целевых показателей проекта.' комментарий должен быть не менее 30 символов."
    }
    if (this.showTarget8_4() && this._form.taskListsText.length < 30) {
      throw "В пункте 'Оценка перечня задач проекта, планируемый способ их реализации и обеспечение достижения поставленных целей проекта." +
      "комментарий должен быть не менее 30 символов."
    }
    if (this._form.technologicalOrderText.length < 30) {
      throw "В пункте 'Уровень технологического уклада научно-технической продукции.'комментарий должен быть не менее 30 символов."
    }
    if ((this.showTarget8_3() || this.showTarget8_4()) && this._form.commerceText.length < 30) {
      throw "В пункте 'Способ коммерциализации результата (-ов) научно-технической деятельности.'комментарий должен быть не менее 30 символов."
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
    if (this._form.competitivenessText.length < 30) {
      throw "В пункте 'Обоснование конкурентоспособности разработки.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.analogText.length < 30) {
      throw "В пункте 'Направленность объекта государственной экспертизы.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.analogParamsText.length < 30) {
      throw "В пункте 'Основные технико-экономические и социально-экономические параметры планируемых новшеств " +
      "(аналога импортируемой продукции), анализ аналогов (прототипов) продукции, а также возможности использования " +
      "промежуточных результатов исследований для других разработок (модификаций, а также в иных сферах экономики).' " +
      "комментарий должен быть не менее 30 символов."
    }
    if (this._form.needsText.length < 30) {
      throw "В пункте 'Обоснование прогнозируемой потребности в разрабатываемой продукции (товарах, услугах) внутри страны " +
      "(возможно по сферам экономики, регионам республики, сведения об основных потребителях), в рамках " +
      "Евразийского экономического союза и дальнего зарубежья.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.risksText.length < 30) {
      throw "В пункте 'Риски реализации проекта.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.privacyObjectsDescriptionText.length < 30) {
      throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' комментарий должен быть не менее 30 символов."
    }
    if (this._form.stagesExistText.length < 30) {
      throw "В пункте 'Льготирование реализации объекта государственной экспертизы. Целесообразность государственной " +
      "регистрации объекта государственной экспертизы в соответствии с законодательством Республики Беларусь.' комментарий должен быть не менее 30 символов."
    }
  }

  private validationCommentsOnConclusionAnalysisAndEvaluation() {
    if (isEmptyOrNull(this._form.priorityAreasText)) {
      throw "В пункте 'Соответствие приоритетным направлениям научной, научно-технической и инновационной деятельности в Республике Беларусь.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.noveltyText)) {
      throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.scientificResearchText)) {
      throw "В пункте 'Вид научного исследования.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.economicSignificanceText)) {
      throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.targetText) && this.showTarget8_3()) {
      throw "В пункте 'Оценка целевых показателей проекта.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.taskListsText)  && this.showTarget8_4()) {
      throw "В пункте 'Оценка перечня задач проекта, планируемый способ их реализации и обеспечение достижения поставленных целей проекта." +
      "' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.technologicalOrderText)) {
      throw "В пункте 'Уровень технологического уклада научно-технической продукции.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.commerceText) && (this.showTarget8_3() || this.showTarget8_4())) {
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
    if (isEmptyOrNull(this._form.competitivenessText)) {
      throw "В пункте 'Обоснование конкурентоспособности разработки.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.analogText)) {
      throw "В пункте 'Направленность объекта государственной экспертизы.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.analogParamsText)) {
      throw "В пункте 'Основные технико-экономические и социально-экономические параметры планируемых новшеств " +
      "(аналога импортируемой продукции), анализ аналогов (прототипов) продукции, а также возможности использования " +
      "промежуточных результатов исследований для других разработок (модификаций, а также в иных сферах экономики).' " +
      "нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.needsText)) {
      throw "В пункте 'Обоснование прогнозируемой потребности в разрабатываемой продукции (товарах, услугах) внутри страны " +
      "(возможно по сферам экономики, регионам республики, сведения об основных потребителях), в рамках " +
      "Евразийского экономического союза и дальнего зарубежья.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.risksText)) {
      throw "В пункте 'Риски реализации проекта.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.privacyObjectsDescriptionText)) {
      throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' нет комментария к заключению."
    }
    if (isEmptyOrNull(this._form.stagesExistText)) {
      throw "В пункте 'Льготирование реализации объекта государственной экспертизы. Целесообразность государственной " +
      "регистрации объекта государственной экспертизы в соответствии с законодательством Республики Беларусь.' нет комментария к заключению."
    }
  }

  private validationConclusionAnalysisAndEvaluation() {
    // if (isEmptyOrNull(this._form.priorityAreas)) {
    //   throw "В пункте 'Соответствие приоритетным направлениям научной, научно-технической и инновационной деятельности в Республике Беларусь.' не выстановленно заключение."
    // }
    if (isEmptyOrNull(this._form.novelty)) {
      throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.scientificResearch)) {
      throw "В пункте 'Вид научного исследования.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.economicSignificance)) {
      throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.target) && this.showTarget8_3()) {
      throw "В пункте 'Оценка целевых показателей проекта.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.taskLists) && this.showTarget8_4()) {
      throw "В пункте 'Оценка перечня задач проекта, планируемый способ их реализации и обеспечение достижения поставленных целей проекта.' " +
      "не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.technologicalOrder)) {
      throw "В пункте 'Уровень технологического уклада научно-технической продукции.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.commerce) && (this.showTarget8_3() || this.showTarget8_4())) {
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
    if (isEmptyOrNull(this._form.competitiveness)) {
      throw "В пункте 'Обоснование конкурентоспособности разработки.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.analog)) {
      throw "В пункте 'Направленность объекта государственной экспертизы.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.analogParams)) {
      throw "В пункте 'Основные технико-экономические и социально-экономические параметры планируемых новшеств " +
      "(аналога импортируемой продукции), анализ аналогов (прототипов) продукции, а также возможности использования " +
      "промежуточных результатов исследований для других разработок (модификаций, а также в иных сферах экономики).' " +
      "не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.needs)) {
      throw "В пункте 'Обоснование прогнозируемой потребности в разрабатываемой продукции (товарах, услугах) внутри страны " +
      "(возможно по сферам экономики, регионам республики, сведения об основных потребителях), в рамках " +
      "Евразийского экономического союза и дальнего зарубежья.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.risks)) {
      throw "В пункте 'Риски реализации проекта.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.privacyObjectsDescription)) {
      throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' не выстановленно заключение."
    }
    if (isEmptyOrNull(this._form.stagesExist)) {
      throw "В пункте 'Льготирование реализации объекта государственной экспертизы. Целесообразность государственной " +
      "регистрации объекта государственной экспертизы в соответствии с законодательством Республики Беларусь.' не выстановленно заключение."
    }
  }


  showTarget8_3() {
    return this.project.code.code.startsWith('8.3');
  }

  showTarget8_4() {
    return this.project.code.code.startsWith('8.4');
  }

  createNewForm(): ExpertReview_8_3_4_12NIOKTR_2025FormContent {
    return new ExpertReview_8_3_4_12NIOKTR_2025FormContent();
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

  setForm(form: ExpertReview_8_3_4_12NIOKTR_2025FormContent) {
    super.setForm(form);
    this._form.termsSuggestion = this._form.termsSuggestion || new PeriodDto();
    
    // Нормализуем boolean поля при первой загрузке: если они false и нет текстовых комментариев,
    // это означает, что они не были выбраны пользователем, устанавливаем в undefined
    if (!this._isFormInitialized) {
      if (this._form.nameAccordance === false && !this._form.nameAccordanceText) {
        this._form.nameAccordance = undefined;
      }
      if (this._form.termsAccordance === false && !this._form.termsAccordanceText) {
        this._form.termsAccordance = undefined;
      }
      if (this._form.socialOrSecurity === false && !this._form.socialOrSecurityText) {
        this._form.socialOrSecurity = undefined;
      }
      if (this._form.financeAccordance === false && !this._form.financeAccordanceText) {
        this._form.financeAccordance = undefined;
      }
      if (this._form.targetAccordance === false && !this._form.targetAccordanceText) {
        this._form.targetAccordance = undefined;
      }
      this._isFormInitialized = true;
    }
  }

}
