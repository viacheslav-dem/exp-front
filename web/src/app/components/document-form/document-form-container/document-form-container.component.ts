import {Component, ComponentFactoryResolver, Input, Type, ViewChild, ViewContainerRef} from "@angular/core";
import {DocumentForm} from "@app/components/document-form/document-form";
import {FormContent} from "@app/components/document-form/form-model/FormContent";

@Component({
  selector: 'app-document-form',
  templateUrl: 'document-form-container.component.html',
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
      let componentFactory = this.resolver.resolveComponentFactory(formRenderer);
      this.formComponent = this.formContainer.createComponent(componentFactory)._component;
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
