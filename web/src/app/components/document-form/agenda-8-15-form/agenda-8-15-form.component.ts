import {Component} from '@angular/core';
import {AgendaForm} from "@app/components/document-form/meeting-protocol-form/agenda-form";
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-agenda-8-15-form',
    templateUrl: './agenda-8-15-form.component.html',
    standalone: false
})
export class Agenda_8_15_FormComponent extends AgendaForm {

  Catalog = Catalog;

  isAccepted(): boolean {
    return this._form.registration.isAccepted();
  }

  getVoted(): number {
    return this._form.registration.getVoted();
  }

  isRescheduled(): boolean {
    return this._form.rescheduled.isAccepted();
  }

  validate() {
    super.validate();
    let voted = this.getVoted();
    this._form.registration.validate(voted);
    this._form.privacy.validate(voted);
    if (this.isAccepted()) {
      this._form.stagesVotes.validate(voted);
    }
  }
}
