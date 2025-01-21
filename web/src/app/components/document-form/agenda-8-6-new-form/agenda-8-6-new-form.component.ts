import {Component} from '@angular/core';
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";

@Component({
  selector: 'app-agenda-8-6-new-form',
  templateUrl: './agenda-8-6-new-form.component.html'
})
export class Agenda_8_6_NewFormComponent extends AgendaNewForm {

  validate() {
    super.validate();
    if ((!this._form.accordance || !this._form.effectAccordance) && this.conclusion.isAccepted()) {
      throw 'Недопустимо положительное заключение при наличии отрицательной оценки ' +
        'в пункте 1 или 2. Проект: ' + this.project.title;
    }
  }
}
