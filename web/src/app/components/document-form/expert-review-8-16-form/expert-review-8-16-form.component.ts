import {Component, Input} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {Catalog} from "@app/services/data.service";
import {ExpertReview_8_16_FormContent} from "@app/components/document-form/form-model/ExpertReview_8_16_FormContent";
import {DocumentService} from "@app/services/document.service";
import {HttpClientSecure} from "@app/services/http.client";


@Component({
  selector: 'app-review-8-16-form',
  templateUrl: './expert-review-8-16-form.component.html'
})
export class ExpertReview_8_16_FormComponent extends ExpertReviewForm<ExpertReview_8_16_FormContent> {
  @Input() url: string = '/examination-api/document/protocol';
  constructor(
      private _documentService: DocumentService,
      private _http: HttpClientSecure
  ) {
    super();
  }

  Catalog = Catalog;

  validate() {}
  downloadDocxDocument() {
        return this._documentService.downloadFile(`${this.url}?${this._http.getTokenParamsString()}`).subscribe();
    }
  onConditionsChanged() {}

  isCatalogHighTechBlockDisabled() {
    if (this._form.conclusion == false){
      return true;
    }
  }

  onChange() {
    if (this._form.economicActivity && this._form.basedOnHighTech && this._form.exportOrientation ||
        this._form.economicActivity && this._form.basedOnHighTech && this._form.importOrientation) {
      this._form.conclusion = true;
    } else {
      this._form.conclusion = false
    }
    this.isCatalogHighTechBlockDisabled()

    this.onConditionsChanged();
  }
}
