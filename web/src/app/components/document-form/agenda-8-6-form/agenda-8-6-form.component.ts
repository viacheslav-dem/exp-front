import {Component} from '@angular/core';
import {AgendaForm} from "@app/components/document-form/meeting-protocol-form/agenda-form";

@Component({
  selector: 'app-agenda-8-6-form',
  templateUrl: './agenda-8-6-form.component.html'
})
export class Agenda_8_6_FormComponent extends AgendaForm {

  isAccepted(): boolean {
    return this._form.accordance.isAccepted() && this._form.effectAccordance.isAccepted();
  }

  getVoted(): number {
    return this._form.accordance.getVoted();
  }

  validate() {
    super.validate();
    let voted = this.getVoted();
    this._form.accordance.validate(voted);
    this._form.effectAccordance.validate(voted);
  }

  isRescheduled(): boolean {
    return this._form.rescheduled.isAccepted();
  }
}
