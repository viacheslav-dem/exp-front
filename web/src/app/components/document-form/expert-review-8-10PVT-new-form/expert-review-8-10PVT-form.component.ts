import {Component, computed, signal} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {
  CriterionItem,
  HighTechCriteria, sortCriteriaItems
} from "@app/components/document-form/form-model/high-tech-criteria";
import {NumberPipe} from "@app/pipes/number.pipe";
import {DataService} from "@app/services/data.service";
import {ExpertReview_8_10PVT_NewFormContent} from "@app/components/document-form/form-model/ExpertReview_8_10PVT_NewFormContent";

@Component({
    selector: 'app-review-8-10PVT-form',
    templateUrl: './expert-review-8-10PVT-form.component.html',
    styles: [`
      .alert.alert-primary:hover {
          opacity: 1;
      }
  `],
    standalone: false
})
export class ExpertReview_8_10PVT_NewFormComponent extends ExpertReviewForm<ExpertReview_8_10PVT_NewFormContent> {

  highTechCriteria: HighTechCriteria;
  
  // Локальный кэш формы для computed (не конфликтует с базовым _formSignal)
  private readonly _localFormCache = signal<any>(null);
  private readonly _highTechCriteriaSignal = signal<HighTechCriteria | null>(null);

  // Computed signal для вычисляемого значения
  readonly conclusion = computed(() => {
    const form = this._localFormCache();
    const highTechCriteria = this._highTechCriteriaSignal();
    if (!form?.highTech || !highTechCriteria) {
      return "";
    }
    let totalScore = form.highTech.score +
      form.exportOrientation.score + form.science.score + form.addedValue.score +
      form.isTitleProtection.score;
    return `${this._numberPipe.transform(totalScore, 3)} из ${highTechCriteria.maxScore} баллов (${
      totalScore > highTechCriteria.maxScore / 2 ? 'возможно отнесение' : 'невозможно отнесение'})`;
  });

  constructor(private _dataService: DataService,
              private _numberPipe: NumberPipe) {
    super();
  }
  
  private updateFormSignal() {
    this._localFormCache.set({ ...this.formValue() });
  }

  ngOnInit() {
    super.ngOnInit();
    this.updateFormSignal();
    this._dataService.getHighTechCriteria().subscribe(res => {
      this.highTechCriteria = res;
      this._highTechCriteriaSignal.set(res);
      this.prepareForm();
    });
  }

  onConditionsChanged() {
    this.markFormChanged();
  }

  validate() {
    super.validate();
  }

  /**
   * Pre-calculate total score
   */
  prepareItems(items: CriterionItem[], weight: number) {
    items.forEach(item => item.score = item.w * weight);
  }

  prepareForm() {
    if (!this.highTechCriteria) {
      return;
    }

    // set default choice
    this.initDefaultForm();

    // pre-calculate scores
    this.prepareItems(this.highTechCriteria.highTech.items, this.highTechCriteria.highTech.w);
    this.prepareItems(this.highTechCriteria.exportOrientation.items, this.highTechCriteria.exportOrientation.w);
    this.prepareItems(this.highTechCriteria.science.items, this.highTechCriteria.science.w);
    this.prepareItems(this.highTechCriteria.addedValue.items, this.highTechCriteria.addedValue.w);
    this.prepareItems(this.highTechCriteria.isTitleProtection.items, this.highTechCriteria.isTitleProtection.w);
  }

  initDefaultForm() {
    const form = this.formValue();
    if ((form.isDefault || !form.highTech) && this.highTechCriteria) {
      const c = this.highTechCriteria;
      this.patchForm({
        highTech: c.highTech.items[0],
        exportOrientation: c.exportOrientation.items[0],
        science: c.science.items[0],
        addedValue: c.addedValue.items[0],
        isTitleProtection: c.isTitleProtection.items[0],
      });
    }
    this.updateFormSignal();
  }

  createNewForm(): ExpertReview_8_10PVT_NewFormContent {
    return new ExpertReview_8_10PVT_NewFormContent();
  }

  override getForm() {
    const form = super.getForm();
    if (this.highTechCriteria) {
      form.maxScore = this.highTechCriteria.maxScore;
    }
    return form;
  }

  override setForm(form: any) {
    super.setForm(form);
    this.initDefaultForm();
    this.updateFormSignal();
  }
}
