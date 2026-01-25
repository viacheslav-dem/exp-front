import {Component} from '@angular/core';
import {AgendaForm} from "@app/components/document-form/meeting-protocol-form/agenda-form";
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-agenda-8-9-form',
    templateUrl: './agenda-8-9-form.component.html',
    standalone: false
})
export class Agenda_8_9_FormComponent extends AgendaForm {

  Catalog = Catalog;

  isAccepted(): boolean {
    return this.formValue().realization?.isAccepted() ?? false;
  }

  getVoted(): number {
    return this.formValue().realization?.getVoted() ?? 0;
  }

  isRescheduled(): boolean {
    return this.formValue().rescheduled?.isAccepted() ?? false;
  }

  validate() {
    super.validate();
    const voted = this.getVoted();
    const f = this.formValue();
    f.realization?.validate(voted);
    f.privacy?.validate(voted);
  }
}
