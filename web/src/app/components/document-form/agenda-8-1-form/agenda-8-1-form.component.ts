import {Component} from '@angular/core';
import {AgendaForm} from "@app/components/document-form/meeting-protocol-form/agenda-form";
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-agenda-8-1-form',
    templateUrl: './agenda-8-1-form.component.html',
    standalone: false
})
export class Agenda_8_1_FormComponent extends AgendaForm {

  Catalog = Catalog;

  isAccepted(): boolean {
    return this.formValue().finance?.isAccepted() ?? false;
  }

  getVoted(): number {
    return this.formValue().finance?.getVoted() ?? 0;
  }
  isRescheduled(): boolean {
    return this.formValue().rescheduled?.isAccepted() ?? false;
  }

  validate() {
    super.validate();
    const voted = this.getVoted();
    const form = this.formValue();
    form.finance?.validate(voted);
    form.privacy?.validate(voted);
    if (this.isAccepted()) {
      form.promotion?.validate(voted);
      form.registration?.validate(voted);
      form.stagesVotes?.validate(voted);
    }
  }
}
