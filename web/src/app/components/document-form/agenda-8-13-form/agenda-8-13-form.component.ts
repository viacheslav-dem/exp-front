import {Component} from '@angular/core';
import {AgendaForm} from "@app/components/document-form/meeting-protocol-form/agenda-form";
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-agenda-8-13-form',
    templateUrl: './agenda-8-13-form.component.html',
    standalone: false
})
export class Agenda_8_13_FormComponent extends AgendaForm {

  Catalog = Catalog;

  isAccepted(): boolean {
    const f = this.formValue();
    return (f.finance?.isAccepted() && f.scientificLevel?.isAccepted()) ?? false;
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
    const f = this.formValue();
    f.finance?.validate(voted);
    f.scientificLevel?.validate(voted);
    f.privacy?.validate(voted);
  }
}
