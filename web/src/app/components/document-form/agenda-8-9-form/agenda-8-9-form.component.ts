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
    return this._form.realization.isAccepted();
  }

  getVoted(): number {
    return this._form.realization.getVoted();
  }

  isRescheduled(): boolean {
    return this._form.rescheduled.isAccepted();
  }

  validate() {
    super.validate();
    let voted = this.getVoted();
    this._form.realization.validate(voted);
    this._form.privacy.validate(voted);
  }
}
