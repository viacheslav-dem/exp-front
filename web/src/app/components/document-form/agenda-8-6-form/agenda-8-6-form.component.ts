import {Component} from '@angular/core';
import {AgendaForm} from "@app/components/document-form/meeting-protocol-form/agenda-form";

@Component({
    selector: 'app-agenda-8-6-form',
    templateUrl: './agenda-8-6-form.component.html',
    standalone: false
})
export class Agenda_8_6_FormComponent extends AgendaForm {

  isAccepted(): boolean {
    const f = this.formValue();
    return (f.accordance?.isAccepted() && f.effectAccordance?.isAccepted()) ?? false;
  }

  getVoted(): number {
    return this.formValue().accordance?.getVoted() ?? 0;
  }

  validate() {
    super.validate();
    const voted = this.getVoted();
    const f = this.formValue();
    f.accordance?.validate(voted);
    f.effectAccordance?.validate(voted);
  }

  isRescheduled(): boolean {
    return this.formValue().rescheduled?.isAccepted() ?? false;
  }
}
