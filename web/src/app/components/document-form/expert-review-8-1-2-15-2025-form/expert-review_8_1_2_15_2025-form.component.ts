import { Component, OnInit } from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {anyMatch, isEmptyOrNull} from "@app/support/utils";
import {
  ExpertReview_8_1_2_15_NewFormContent
} from "@app/components/document-form/form-model/ExpertReview_8_1_2_15_NewFormContent";
import {PeriodDto} from "@app/dto/PeriodDto";
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {
  ExpertReview_8_1_2_15_2025FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_1_2_15_2025FormContent";
import {DataService} from "@app/services/data.service";

@Component({
  selector: 'app-expert-review-8-1-2-15-2025-form',
  templateUrl: './expert-review_8_1_2_15_2025-form.component.html',
  standalone: false
})
export class ExpertReview_8_1_2_15_2025FormComponent extends ExpertReviewForm<ExpertReview_8_1_2_15_2025FormContent> {

  noveltyOptions: string[] = [];

  constructor(private _dataService: DataService) {
    super();
  }

  ngOnInit() {
    this._dataService.getCommercializationMethods().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      res.forEach(option => this.noveltyOptions.push(option.name))
    })
  }

  validate() {
    super.validate();
    this.validationConclusionAnalysisAndEvaluation();
    const form = this.formValue();
    if (form.financeSuggestion < 0) {
      throw 'Предложенная сумма финансирования не может быть меньше нуля.'
    }
  }

  private validationConclusionAnalysisAndEvaluation() {
    const form = this.formValue();
    if (isEmptyOrNull(form.novelty)) {
      throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' не выстановленно заключение."
    }
    if (isEmptyOrNull(form.economicSignificance)) {
      throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' не выстановленно заключение."
    }
    if (isEmptyOrNull(form.commerce)) {
      throw "В пункте 'Способ коммерциализации результата (-ов) научно-технической деятельности.' не выстановленно заключение."
    }
    if (isEmptyOrNull(form.resourcesSufficiency)) {
      throw "В пункте 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' не выстановленно заключение."
    }
    if (isEmptyOrNull(form.competenceSufficiency)) {
      throw "В пункте 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' не выстановленно заключение."
    }
    if (isEmptyOrNull(form.marketingResearch)) {
      throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' не выстановленно заключение."
    }
    if (isEmptyOrNull(form.risks)) {
      throw "В пункте 'Риски реализации проекта.' не выстановленно заключение."
    }
    if (isEmptyOrNull(form.privacyObjectsDescription)) {
      throw "В пункте 'Создание объекта права промышленной собственности.' не выстановленно заключение."
    }
    if (isEmptyOrNull(form.stagesExist)) {
      throw "В пункте 'Целесообразность государственной " +
      "регистрации объекта государственной экспертизы в соответствии с законодательством Республики Беларусь.' не выстановленно заключение."
    }
  }

  createNewForm(): ExpertReview_8_1_2_15_2025FormContent {
    return new ExpertReview_8_1_2_15_2025FormContent();
  }

  isFinanceConclusionDisabled() {
    const form = this.formValue();
    return !anyMatch(form.novelty, 'новый для Республики Беларусь', 'новый для стран СНГ', 'новизна мирового уровня')
        || !anyMatch(form.economicSignificance, 'средняя', 'высокая');
  }

  isConclusionDisabled() {
    return !this.formValue().financeConclusion;
  }

  onConditionsChanged() {
    this.markFormChanged();
    if (this.isFinanceConclusionDisabled()) {
      this.patchForm({ financeConclusion: false } as Partial<ExpertReview_8_1_2_15_2025FormContent>);
    }
    if (this.isConclusionDisabled()) {
      this.patchForm({ conclusion: false } as Partial<ExpertReview_8_1_2_15_2025FormContent>);
    }
  }

  override setForm(form: ExpertReview_8_1_2_15_2025FormContent) {
    super.setForm(form);
    this.updateForm(f => ({ ...f, termsSuggestion: f.termsSuggestion || new PeriodDto() }));
  }
}

