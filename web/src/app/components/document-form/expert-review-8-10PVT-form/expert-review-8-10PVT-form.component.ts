import {Component, computed, signal} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {
  CriterionItem,
  HighTechCriteria,
  sortCriteriaItems
} from "@app/components/document-form/form-model/high-tech-criteria";
import {NumberPipe} from "@app/pipes/number.pipe";
import {Catalog, DataService} from "@app/services/data.service";

@Component({
    selector: 'app-review-8-10PVT-form',
    templateUrl: './expert-review-8-10PVT-form.component.html',
    standalone: false
})
export class ExpertReview_8_10PVT_FormComponent extends ExpertReviewForm<any> {

  Catalog = Catalog;

  highTechCriteria: HighTechCriteria;
  
  // Signal для отслеживания изменений формы и критериев
  private readonly _formSignal = signal<any>(null);
  private readonly _highTechCriteriaSignal = signal<HighTechCriteria | null>(null);

  // Computed signal для вычисляемого значения
  readonly conclusion = computed(() => {
    const form = this._formSignal();
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
    this._formSignal.set({ ...this._form });
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
    this.prepareItems(this.highTechCriteria.exportOrientation.items, this.highTechCriteria.exportOrientation.w);
    this.prepareItems(this.highTechCriteria.science.items, this.highTechCriteria.science.w);
    this.prepareItems(this.highTechCriteria.addedValue.items, this.highTechCriteria.addedValue.w);
    this.prepareItems(this.highTechCriteria.isTitleProtection.items, this.highTechCriteria.isTitleProtection.w);
  }

  initDefaultForm() {
    if ((this._form.isDefault || !this._form.highTech) && this.highTechCriteria) {
      this._form.highTech = this.highTechCriteria.highTech.items[0];
      this._form.exportOrientation = this.highTechCriteria.exportOrientation.items[0];
      this._form.science = this.highTechCriteria.science.items[0];
      this._form.addedValue = this.highTechCriteria.addedValue.items[0];
      this._form.intellectualProperty = this.highTechCriteria.isTitleProtection.items[0];
    }
    this.updateFormSignal();
  }

  getForm() {
    let form = super.getForm();
    form.maxScore = this.highTechCriteria.maxScore;
    return form;
  }

  setForm(form: any) {
    super.setForm(form);
    this.initDefaultForm();
    this.updateFormSignal();
  }
}
