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
    return this._form.finance.isAccepted() && this._form.scientificLevel.isAccepted();
  }

  getVoted(): number {
    return this._form.finance.getVoted();
  }

  isRescheduled(): boolean {
    return this._form.rescheduled.isAccepted();
  }

  validate() {
    super.validate();
    let voted = this.getVoted();
    this._form.finance.validate(voted);
    this._form.scientificLevel.validate(voted);
    this._form.privacy.validate(voted);
  }
}
