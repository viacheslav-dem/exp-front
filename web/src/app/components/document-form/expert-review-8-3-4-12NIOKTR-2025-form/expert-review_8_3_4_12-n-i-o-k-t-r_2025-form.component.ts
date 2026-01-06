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
  templateUrl: './expert-review_8_3_4_12-n-i-o-k-t-r_2025-form.component.html',
  standalone: false
})
export class ExpertReview_8_3_4_12NIOKTR_2025FormComponent extends ExpertReviewForm<ExpertReview_8_3_4_12NIOKTR_2025FormContent> {

  noveltyOptions: string[] = [];

  constructor(private _dataService: DataService) {
    super();
  }

  ngOnInit() {
    this._dataService.getCommercializationMethods().subscribe(res => {
      res.forEach(option => this.noveltyOptions.push(option.name))
    })
  }

  validate() {
    // Инкрементальная миграция: required/minlength/maxlength реализованы через template-driven validators в блоках,
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
    this.validationConclusionAnalysisAndEvaluation();
    // Бизнес-валидация: проверка суммы финансирования
    if (this._form.financeSuggestion < 0) {
      throw 'Предложенная сумма финансирования не может быть меньше нуля.'
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
  }

}
