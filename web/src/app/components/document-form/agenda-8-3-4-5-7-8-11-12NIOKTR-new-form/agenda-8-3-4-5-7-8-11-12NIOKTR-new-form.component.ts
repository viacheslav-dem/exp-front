import {Component} from '@angular/core';
import {isEmptyOrNull} from "@app/support/utils";
import {Agenda_8_1_2_NewFormComponent} from "@app/components/document-form/agenda-8-1-2-new-form/agenda-8-1-2-new-form.component";

@Component({
    selector: 'app-agenda-8-3-4-5-7-8-11-12NIOKTR-new-form',
    templateUrl: './agenda-8-3-4-5-7-8-11-12NIOKTR-new-form.component.html',
    standalone: false
})
export class Agenda_8_3_4_5_7_8_11_12NIOKTR_NewFormComponent extends Agenda_8_1_2_NewFormComponent {

  constructor() {
    super();
    this.financeConclusionNum = '11.4';
  }

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.marketingResearch)) {
      throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
    }
  }
}
