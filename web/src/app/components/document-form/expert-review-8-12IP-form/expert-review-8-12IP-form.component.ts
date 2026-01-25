import {Component, computed, signal} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {IndustryDto} from "@app/dto/IndustryDto";
import {Catalog, DataService} from "@app/services/data.service";

@Component({
    selector: 'app-review-8-12IP-form',
    templateUrl: './expert-review-8-12IP-form.component.html',
    standalone: false
})
export class ExpertReview_8_12IP_FormComponent extends ExpertReviewForm<any> {

  industries: IndustryDto[];
  Catalog = Catalog;

  // Локальный кэш формы для computed (не конфликтует с базовым _formSignal)
  private readonly _localFormCache = signal<any>(null);
  
  // Computed signals для вычисляемых значений
  readonly organizationLabel = computed(() => {
    const form = this._localFormCache();
    if (!form) return "не соответствует";
    if (form.addedValue != null && !form.addedValueNotPresented && form.section != null &&
      !form.sectionNotPresented && form.addedValue >= form.section.addedValueBound) {
      return "соответствует";
    }
    return "не соответствует";
  });

  readonly exportLabel = computed(() => {
    const form = this._localFormCache();
    if (!form) return "не соответствует";
    if (form.balance != null && !form.balanceNotPresented && form.balance > 0) {
      return "соответствует";
    }
    return "не соответствует";
  });

  constructor(private _dataService: DataService) {
    super();
  }
  
  updateFormSignal() {
    this._localFormCache.set({ ...this.formValue() });
  }

  ngOnInit() {
    super.ngOnInit();
    this.updateFormSignal();
    this._dataService.getCatalog<IndustryDto>(Catalog.INDUSTRY).subscribe(res => {
      this.industries = res;
      this.initDefaultForm();
    });
  }

  onChooseSection() {
    const f = this.formValue();
    const sectionNotPresented = !f.sectionNotPresented;
    this.patchForm({ sectionNotPresented });
    const next = this.formValue();
    if (!next.sectionNotPresented && !next.section) {
      const empty = this.industries.length == 0;
      this.patchForm({ sectionNotPresented: empty, section: empty ? null : this.industries[0] });
    }
    this.updateFormSignal();
  }

  initDefaultForm() {
    const f = this.formValue();
    if (f.isDefault && this.industries) {
      const empty = this.industries.length == 0;
      this.patchForm({ sectionNotPresented: empty, section: empty ? null : this.industries[0] });
    }
    const form = this.formValue();
    if (!form.section && !form.sectionNotPresented) {
      this.patchForm({ sectionNotPresented: true });
    }
    this.updateFormSignal();
  }

  override getForm() {
    const form = super.getForm();
    const f = this.formValue();
    if (f.sectionNotPresented) form.section = null;
    if (f.addedValueNotPresented) form.addedValue = null;
    if (f.balanceNotPresented) form.balance = null;
    return form;
  }

  override setForm(form: any) {
    super.setForm(form);
    this.initDefaultForm();
    this.updateFormSignal();
  }

  validate() {
    // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
    // Проверка product/service оставлена через throw, так как это boolean и сложно валидировать через template-driven
    const f = this.formValue();
    if (f.product == null && f.service == null) {
      throw 'Пожалуйста, выберите тип конечного результата проекта.'
    }
  }
}
