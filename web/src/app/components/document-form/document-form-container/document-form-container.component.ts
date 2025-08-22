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
  @ViewChild('form', {read: ViewContainerRef}) formContainer: any;

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
    console.log("document-from-container")
    if (formRenderer) {
      console.log(formRenderer);
      while (this.formContainer.length > 0) {
        this.formContainer.get(0).destroy();
      }
      console.log("111");
      console.log(formRenderer);
      let componentFactory = this.resolver.resolveComponentFactory(formRenderer);
      console.log("222");
      this.formComponent = this.formContainer.createComponent(componentFactory)._component;
      console.log("333");
      if (this._formRenderer && this._formRenderer != formRenderer) {
        console.log("444");
        console.warn('change of document form container is bad practice!');
      }
      console.log("555");
      this._formRenderer = formRenderer;
      console.log(this._formRenderer);
      if (!this._form) {
        console.log(666)
        this._form = this.formComponent._form;
        console.log(this._form);
      } else {
        console.log(777)
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
