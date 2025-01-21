import {Component} from '@angular/core';
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";

@Component({
  selector: 'app-agenda-8-10PIT-new-form',
  templateUrl: './agenda-8-10PIT-new-form.component.html'
})
export class Agenda_8_10PIT_NewFormComponent extends AgendaNewForm {

  validate() {
    super.validate();
    if (!this._form.innovative && this.conclusion.isAccepted()) {
      throw 'Недопустимо положительное заключение при наличии отрицательной оценки ' +
      'в пункте 1. Проект: ' + this.project.title;
    }
  }
}
