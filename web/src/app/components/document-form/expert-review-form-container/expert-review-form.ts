import {DocumentForm} from "app/components/document-form/document-form";
import {isEmptyOrNull} from "@app/support/utils";
import {Injectable} from "@angular/core";
import {ExpertReviewFormContent} from "@app/components/document-form/form-model/ExpertReviewFormContent";
import {ProjectDto} from "@app/dto/ProjectDto";
import {ExpertReviewFormContainerComponent} from "@app/components/document-form/expert-review-form-container/expert-review-form-container.component";

@Injectable()
export class ExpertReviewForm<Form extends ExpertReviewFormContent> extends DocumentForm<Form> {

  parent: ExpertReviewFormContainerComponent<Form>;
  project: ProjectDto;

  /* for old forms */
  privacyObjects: { name: string }[] = [];
  stages: { name: string }[] = [];
  notes: { name: string }[] = [];

  createNewForm(): Form {
    return new ExpertReviewFormContent() as Form;
  }

  getForm() {
    let form: Form = super.getForm();
    form.wrappedNotes = form.wrappedNotes.filter(note => !isEmptyOrNull(note.text));

    /* for old forms */
    form.privacyObjects = this.privacyObjects.filter(obj => obj != null)
      .map(obj => obj.name)
      .filter(str => !isEmptyOrNull(str));
    form.notes = this.notes.map(obj => obj.name).filter(str => !isEmptyOrNull(str));
    form.stages = this.stages.map(obj => obj.name).filter(str => !isEmptyOrNull(str));

    return form;
  }

  setForm(form: Form) {
    super.setForm(form);
    this._form.program = this.project.program;
    if(this.project.study != null){
      this._form.study = this.project.study.name;
    }

    this._form.wrappedNotes = this._form.wrappedNotes || [];

    /* for old forms */
    this._form.privacyObjects = this._form.privacyObjects || [];
    this._form.stages = this._form.stages || [];
    this._form.notes = this._form.notes || [];

    this.privacyObjects = this._form.privacyObjects.map(name => {
      return {name: name};
    });
    this.stages = this._form.stages.map(name => {
      return {name: name};
    });
    this.notes = this._form.notes.map(name => {
      return {name: name};
    });
  }
}
