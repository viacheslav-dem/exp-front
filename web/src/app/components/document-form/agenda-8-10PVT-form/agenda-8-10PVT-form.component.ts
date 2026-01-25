import {Component} from '@angular/core';
import {AgendaForm} from "@app/components/document-form/meeting-protocol-form/agenda-form";
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-agenda-8-10PVT-form',
    templateUrl: './agenda-8-10PVT-form.component.html',
    standalone: false
})
export class Agenda_8_10PVT_FormComponent extends AgendaForm {

  Catalog = Catalog;

  isAccepted(): boolean {
    return this.formValue().hightech?.isAccepted() ?? false;
  }

  getVoted(): number {
    return this.formValue().hightech?.getVoted() ?? 0;
  }

  isRescheduled(): boolean {
    return this.formValue().rescheduled?.isAccepted() ?? false;
  }

  validate() {
    super.validate();
    const voted = this.getVoted();
    this.formValue().hightech?.validate(voted);
    this.formValue().privacy?.validate(voted);
  }
}
