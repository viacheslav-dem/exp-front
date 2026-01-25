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
    const form: Form = super.getForm();
    form.wrappedNotes = form.wrappedNotes.filter(note => !isEmptyOrNull(note.text));
    form.privacyObjects = this.privacyObjects.filter(obj => obj != null)
      .map(obj => obj.name)
      .filter(str => !isEmptyOrNull(str));
    form.notes = this.notes.map(obj => obj.name).filter(str => !isEmptyOrNull(str));
    form.stages = this.stages.map(obj => obj.name).filter(str => !isEmptyOrNull(str));
    return form;
  }

  override setForm(form: Form) {
    if (!form) {
      super.setForm(form);
      return;
    }
    let hours: number | undefined = undefined;
    if (form.hours != null) {
      const h = typeof form.hours === 'string' ? Number(form.hours) : form.hours;
      if (!isNaN(h)) hours = h;
    }
    const normalized: Form = {
      ...form,
      hours,
      wrappedNotes: form.wrappedNotes || [],
      privacyObjects: form.privacyObjects || [],
      stages: form.stages || [],
      notes: form.notes || [],
    };
    super.setForm(normalized);
    this.updateForm(f => ({
      ...f,
      program: this.project?.program ?? f.program,
      study: this.project?.study?.name ?? f.study,
      wrappedNotes: f.wrappedNotes || [],
      privacyObjects: f.privacyObjects || [],
      stages: f.stages || [],
      notes: f.notes || [],
    }));
    const f = this.formValue();
    this.privacyObjects = f.privacyObjects.map(name => ({ name }));
    this.stages = f.stages.map(name => ({ name }));
    this.notes = f.notes.map(name => ({ name }));
  }
}
