import {Component, Input} from "@angular/core";
import {DocumentFormContainerComponent} from "@app/components/document-form/document-form-container/document-form-container.component";
import {ProjectDto} from "@app/dto/ProjectDto";
import {ExpertReviewFormContent} from "@app/components/document-form/form-model/ExpertReviewFormContent";
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {TemplateType} from "@app/components/document-form/form-model/TemplateType";
import {DraftService} from "@app/components/document-form/draft.service";
import {IdDto} from "@app/dto/IdDto";

@Component({
  selector: 'app-expert-review-form',
  templateUrl: 'expert-review-form-container.component.html',
  styles: [`
      ::ng-deep .hint {
          margin-top: 0.5rem;
          font-style: italic;
          font-size: 0.875rem;
      }

      ::ng-deep .hint p {
          margin-bottom: 0.5rem;
      }

      ::ng-deep .hint ul {
          margin-bottom: 0.5rem;
      }
  `]
})
export class ExpertReviewFormContainerComponent<Form extends ExpertReviewFormContent> extends DocumentFormContainerComponent<Form> {

  _project: ProjectDto;

  // Override parent @Input to expose as component input (parent field is used directly)
  @Input() draftService: DraftService<Form>;
  @Input() draftOwner: IdDto;

  @Input()
  set project(project) {
    this._project = project;
    this.update();
  }

  updateFormComponent(formRenderer) {
    super.updateFormComponent(formRenderer);
    this.update();
  }

  private update() {
    if (this.formComponent) {
      (this.formComponent as ExpertReviewForm<Form>).parent = this;
      (this.formComponent as ExpertReviewForm<Form>).project = this._project;
    }
  }

  validate() {
    super.validate();
    if (!this._form.hours || this._form.hours < 1) {
      throw 'Количество часов должно быть положительным числом.';
    }
  }

  isOldReviewType() {
    return !this._project.code.expertReviewType.endsWith('_NEW');
  }

  canHasSocialEconomicGoals() {
    return this._project.code.code == '8.13';
  }

  needSelectDirections() {
    return !this.isOldReviewType()
      && this._project.code.expertReviewType != TemplateType.EXPERT_REVIEW_8_10PVT_NEW
      && this._project.code.expertReviewType != TemplateType.EXPERT_REVIEW_8_10PIT_NEW;
  }
}
