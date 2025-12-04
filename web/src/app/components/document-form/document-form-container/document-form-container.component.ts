import {Component, ComponentFactoryResolver, Input, Type, ViewChild, ViewContainerRef} from "@angular/core";
import {DocumentForm} from "@app/components/document-form/document-form";
import {FormContent} from "@app/components/document-form/form-model/FormContent";

@Component({
    selector: 'app-document-form',
    templateUrl: 'document-form-container.component.html',
    standalone: false
})
export class DocumentFormContainerComponent<Form extends FormContent> extends DocumentForm<Form> {

  _formRenderer: Type<DocumentForm<Form>>;
  formComponent: DocumentForm<Form>;
  @ViewChild('form', { read: ViewContainerRef, static: true }) formContainer: any;

  constructor(private resolver: ComponentFactoryResolver) {
    super();
  }

  createNewForm(): Form {
    return null;
  }

  @Input()
  set formRenderer(formRenderer) {
    this.updateFormComponent(formRenderer);
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
    }
  }

  getForm(): Form {
    return this.formComponent.getForm();
  }

  validate() {
    this.formComponent.validate();
  }

  setForm(form: Form) {
    super.setForm(form)
    if (this.formComponent) {
      this.formComponent.setForm(this._form);
    }
  }
}
