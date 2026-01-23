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

  // Signal для отслеживания изменений формы
  private readonly _formSignal = signal<any>(null);
  
  // Computed signals для вычисляемых значений
  readonly organizationLabel = computed(() => {
    const form = this._formSignal();
    if (!form) return "не соответствует";
    if (form.addedValue != null && !form.addedValueNotPresented && form.section != null &&
      !form.sectionNotPresented && form.addedValue >= form.section.addedValueBound) {
      return "соответствует";
    }
    return "не соответствует";
  });

  readonly exportLabel = computed(() => {
    const form = this._formSignal();
    if (!form) return "не соответствует";
    if (form.balance != null && !form.balanceNotPresented && form.balance > 0) {
      return "соответствует";
    }
    return "не соответствует";
  });

  constructor(private _dataService: DataService) {
    super();
  }
  
  private updateFormSignal() {
    this._formSignal.set({ ...this._form });
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
    this._form.sectionNotPresented = !this._form.sectionNotPresented;
    if (!this._form.sectionNotPresented && !this._form.section) {
      this._form.sectionNotPresented = this.industries.length == 0;
      this._form.section = this.industries.length == 0 ? null : this.industries[0];
    }
    this.updateFormSignal();
  }

  initDefaultForm() {
    if (this._form.isDefault && this.industries) {
      this._form.sectionNotPresented = this.industries.length == 0;
      this._form.section = this.industries.length == 0 ? null : this.industries[0];
    }
    // for test purposes
    if (!this._form.section && !this._form.sectionNotPresented) {
      this._form.sectionNotPresented = true;
    }
    this.updateFormSignal();
  }

  getForm() {
    let form = super.getForm();
    if (this._form.sectionNotPresented) {
      form.section = null;
    }
    if (this._form.addedValueNotPresented) {
      form.addedValue = null;
    }
    if (this._form.balanceNotPresented) {
      form.balance = null;
    }
    return form;
  }

  setForm(form: any) {
    super.setForm(form);
    this.initDefaultForm();
    this.updateFormSignal();
  }

  validate() {
    // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
    // Проверка product/service оставлена через throw, так как это boolean и сложно валидировать через template-driven
    if (this._form.product == null && this._form.service == null) {
      throw 'Пожалуйста, выберите тип конечного результата проекта.'
    }
  }
}
