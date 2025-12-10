import {Component} from '@angular/core';
import {AgendaForm} from "@app/components/document-form/meeting-protocol-form/agenda-form";
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-agenda-8-12IP-form',
    templateUrl: './agenda-8-12IP-form.component.html',
    standalone: false
})
export class Agenda_8_12IP_FormComponent extends AgendaForm {

  Catalog = Catalog;

  product: boolean;
  service: boolean;

  isAccepted(): boolean {
    return this._form.novelty.isAccepted() &&
      (!this.product && (this._form.organization.isAccepted() || this._form.export.isAccepted()) ||
        this.product && this._form.organization.isAccepted() && this._form.export.isAccepted());
  }

  getVoted(): number {
    return this._form.novelty.getVoted();
  }

  isRescheduled(): boolean {
    return this._form.rescheduled.isAccepted();
  }

  validate() {
    super.validate();
    if (this.product == null && this.service == null) {
      throw 'Пожалуйста, выберите тип конечного результата проекта.'
    }
    let voted = this.getVoted();
    this._form.novelty.validate(voted);
    this._form.organization.validate(voted);
    this._form.export.validate(voted);
    this._form.privacy.validate(voted);
  }
}
