import {Component, input} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {Catalog} from "@app/services/data.service";
import {ExpertReview_8_16_FormContent} from "@app/components/document-form/form-model/ExpertReview_8_16_FormContent";
import {DocumentService} from "@app/services/document.service";
import {HttpClientSecure} from "@app/services/http.client";


@Component({
    selector: 'app-review-8-16-form',
    templateUrl: './expert-review-8-16-form.component.html',
    standalone: false
})
export class ExpertReview_8_16_FormComponent extends ExpertReviewForm<ExpertReview_8_16_FormContent> {
  readonly url = input<string>('/examination-api/document/protocol');
  constructor(
      private _documentService: DocumentService,
      private _http: HttpClientSecure
  ) {
    super();
  }

  Catalog = Catalog;

  validate() {
    // Инкрементальная миграция: обязательность и мин.длина выражены template-driven валидаторами в блоках,
    // чтобы контейнер гарантированно находил .ng-invalid и скроллил без зависимости от throw.
    super.validate();
  }
  downloadDocxDocument() {
        return this._documentService.downloadFile(`${this.url()}?${this._http.getTokenParamsString()}`).subscribe();
    }
  onConditionsChanged() {}

  isCatalogHighTechBlockDisabled(): boolean {
    return this.formValue().conclusion === false;
  }

  onChange() {
    const f = this.formValue();
    if (f.economicActivity && f.basedOnHighTech && f.exportOrientation ||
        f.economicActivity && f.basedOnHighTech && f.importOrientation) {
      this.patchForm({ conclusion: true });
    } else {
      this.patchForm({ conclusion: false });
    }
    this.onConditionsChanged();
  }
}
