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
    const f = this.formValue();
    return f.novelty?.isAccepted() &&
      (!this.product && (f.organization?.isAccepted() || f.export?.isAccepted()) ||
        this.product && f.organization?.isAccepted() && f.export?.isAccepted());
  }

  getVoted(): number {
    return this.formValue().novelty?.getVoted() ?? 0;
  }

  isRescheduled(): boolean {
    return this.formValue().rescheduled?.isAccepted() ?? false;
  }

  validate() {
    super.validate();
    if (this.product == null && this.service == null) {
      throw 'Пожалуйста, выберите тип конечного результата проекта.'
    }
    const voted = this.getVoted();
    const f = this.formValue();
    f.novelty?.validate(voted);
    f.organization?.validate(voted);
    f.export?.validate(voted);
    f.privacy?.validate(voted);
  }
}
