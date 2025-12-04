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
    return this._form.innovativeness.isAccepted();
  }

  getVoted(): number {
    return this._form.innovativeness.getVoted();
  }

  isRescheduled(): boolean {
    return this._form.rescheduled.isAccepted();
  }

  validate() {
    super.validate();
    let voted = this.getVoted();
    this._form.innovativeness.validate(voted);
    this._form.privacy.validate(voted);
  }
}
