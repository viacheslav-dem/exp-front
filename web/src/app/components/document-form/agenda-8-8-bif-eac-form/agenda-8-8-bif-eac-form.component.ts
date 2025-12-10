import {Component} from '@angular/core';
import {isEmptyOrNull} from "@app/support/utils";
import {Agenda_8_1_2_NewFormComponent} from "@app/components/document-form/agenda-8-1-2-new-form/agenda-8-1-2-new-form.component";

@Component({
    selector: 'app-agenda-8-8-bif-eac-form',
    templateUrl: './agenda-8-8-bif-eac-form.component.html',
    standalone: false
})
export class Agenda_8_8_Bif_Eac_FormComponent extends Agenda_8_1_2_NewFormComponent {

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
