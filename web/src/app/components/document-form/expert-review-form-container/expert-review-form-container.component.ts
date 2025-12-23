import {Component, Input, input, ChangeDetectionStrategy, ChangeDetectorRef, ComponentFactoryResolver} from "@angular/core";
import {DocumentFormContainerComponent} from "@app/components/document-form/document-form-container/document-form-container.component";
import {ProjectDto} from "@app/dto/ProjectDto";
import {ExpertReviewFormContent} from "@app/components/document-form/form-model/ExpertReviewFormContent";
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {TemplateType} from "@app/components/document-form/form-model/TemplateType";
import {DraftService} from "@app/components/document-form/draft.service";
import {IdDto} from "@app/dto/IdDto";
import {environment} from "../../../../environments/environment";

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
  `],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class ExpertReviewFormContainerComponent<Form extends ExpertReviewFormContent> extends DocumentFormContainerComponent<Form> {
  
  constructor(resolver: ComponentFactoryResolver, cdr: ChangeDetectorRef) {
    super(resolver, cdr);
  }

  _project: ProjectDto;

  // Управляемое состояние загрузки (прокидывается из контейнера, где выполняется HTTP)
  readonly loading = input<boolean>(false);

  // Override parent @Input to expose as component input (parent field is used directly)
  readonly draftService = input<DraftService<Form>>(undefined);
  readonly draftOwner = input<IdDto>(undefined);

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

  private getExpertReviewType(): string | undefined {
    // Проект может приходить частично загруженным или ошибочно переданным (например, signal вместо значения).
    // В проде лучше деградировать без падения UI.
    return this._project?.code?.expertReviewType;
  }

  isOldReviewType() {
    const type = this.getExpertReviewType();
    // Консервативное поведение: если тип неизвестен, считаем форму "старой", чтобы не требовать доп. выбора направлений.
    if (!type) return true;
    return !type.endsWith('_NEW');
  }

  canHasSocialEconomicGoals() {
    return this._project?.code?.code === '8.13';
  }

  needSelectDirections() {
    const type = this.getExpertReviewType();
    if (!type) return false;
    return !this.isOldReviewType()
      && type !== TemplateType.EXPERT_REVIEW_8_10PVT_NEW
      && type !== TemplateType.EXPERT_REVIEW_8_10PIT_NEW;
  }
}
