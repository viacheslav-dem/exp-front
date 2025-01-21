import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {IndustryDto} from "@app/dto/IndustryDto";
import {Catalog, DataService} from "@app/services/data.service";
import {isEmptyOrNull} from "@app/support/utils";

@Component({
  selector: 'app-review-8-12IP-form',
  templateUrl: './expert-review-8-12IP-form.component.html'
})
export class ExpertReview_8_12IP_FormComponent extends ExpertReviewForm<any> {

  industries: IndustryDto[];
  Catalog = Catalog;

  constructor(private _dataService: DataService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
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
  }

  get organizationLabel() {
    if (this._form.addedValue != null && !this._form.addedValueNotPresented && this._form.section != null &&
      !this._form.sectionNotPresented && this._form.addedValue >= this._form.section.addedValueBound) {
      return "соответствует";
    }
    return "не соответствует"
  }

  get exportLabel() {
    if (this._form.balance != null && !this._form.balanceNotPresented && this._form.balance > 0) {
      return "соответствует";
    }
    return "не соответствует"
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
  }

  validate() {
    super.validate();
    if (this._form.product == null && this._form.service == null) {
      throw 'Пожалуйста, выберите тип конечного результата проекта.'
    }
    if (isEmptyOrNull(this._form.accordance) ||
      isEmptyOrNull(this._form.marketing) ||
      !this._form.sectionNotPresented && isEmptyOrNull(this._form.sectionPlace) ||
      !this._form.addedValueNotPresented && this._form.addedValue == null ||
      !this._form.addedValueNotPresented && isEmptyOrNull(this._form.addedValuePlace) ||
      !this._form.balanceNotPresented && this._form.balance == null ||
      !this._form.balanceNotPresented && isEmptyOrNull(this._form.balancePlace) ||
      isEmptyOrNull(this._form.scientificLevel) ||
      isEmptyOrNull(this._form.analogue) ||
      isEmptyOrNull(this._form.differences) ||
      isEmptyOrNull(this._form.relevance) ||
      isEmptyOrNull(this._form.consequences)) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
  }
}
