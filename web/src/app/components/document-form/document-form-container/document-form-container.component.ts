import {Component, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef, ChangeDetectionStrategy, ChangeDetectorRef, effect, input} from "@angular/core";
import {DocumentForm} from "@app/components/document-form/document-form";
import {FormContent} from "@app/components/document-form/form-model/FormContent";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-document-form',
    templateUrl: 'document-form-container.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class DocumentFormContainerComponent<Form extends FormContent> extends DocumentForm<Form> {

  _formRenderer: Type<DocumentForm<Form>>;
  formComponent: DocumentForm<Form>;
  @ViewChild('form', { read: ViewContainerRef, static: true }) formContainer: any;

  readonly formRenderer = input<Type<DocumentForm<Form>> | undefined>(undefined);
  private readonly _formRendererEffect = effect(() => {
    const formRenderer = this.formRenderer();
    if (!formRenderer) return;
    this.updateFormComponent(formRenderer);
  });

  constructor(private resolver: ComponentFactoryResolver,
              protected cdr: ChangeDetectorRef) {
    super();
  }

  createNewForm(): Form {
    return null;
  }

  updateFormComponent(formRenderer) {
    if (formRenderer) {
      while (this.formContainer.length > 0) {
        this.formContainer.get(0).destroy();
      }
      const componentFactory = this.resolver.resolveComponentFactory(formRenderer);
      const componentRef = this.formContainer.createComponent(componentFactory);
      this.formComponent = componentRef.instance as DocumentForm<Form>;
      if (this._formRenderer && this._formRenderer != formRenderer) {
        console.warn('change of document form container is bad practice!');
      }
      this._formRenderer = formRenderer;
      if (!this._form) {
        this._form = this.formComponent._form;
      } else {
        this.formComponent.setForm(this._form);
      }
      this.cdr?.markForCheck?.();
    }
  }

  getForm(): Form {
    return this.formComponent.getForm();
  }

  validate() {
    this.formComponent.validate();
  }

  override setForm(form: Form) {
    super.setForm(form)
    if (this.formComponent) {
      this.formComponent.setForm(this._form);
    }
    this.cdr?.markForCheck?.();
  }
}
