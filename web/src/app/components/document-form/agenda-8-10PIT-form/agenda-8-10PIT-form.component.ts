import {Component} from '@angular/core';
import {AgendaForm} from "@app/components/document-form/meeting-protocol-form/agenda-form";
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-agenda-8-10PIT-form',
    templateUrl: './agenda-8-10PIT-form.component.html',
    standalone: false
})
export class Agenda_8_10PIT_FormComponent extends AgendaForm {

  Catalog = Catalog;

  isAccepted(): boolean {
    return this.formValue().innovativeness?.isAccepted() ?? false;
  }

  getVoted(): number {
    return this.formValue().innovativeness?.getVoted() ?? 0;
  }

  isRescheduled(): boolean {
    return this.formValue().rescheduled?.isAccepted() ?? false;
  }

  validate() {
    super.validate();
    const voted = this.getVoted();
    this.formValue().innovativeness?.validate(voted);
    this.formValue().privacy?.validate(voted);
  }
}
