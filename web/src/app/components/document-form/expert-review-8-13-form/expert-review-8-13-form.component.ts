import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {isEmptyOrNull} from "@app/support/utils";
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-review-8-13-form',
    templateUrl: './expert-review-8-13-form.component.html',
    standalone: false
})
export class ExpertReview_8_13_FormComponent extends ExpertReviewForm<any> {

  Catalog = Catalog;

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.accordance) ||
      isEmptyOrNull(this._form.state) ||
      isEmptyOrNull(this._form.prognosis)) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
  }
}
