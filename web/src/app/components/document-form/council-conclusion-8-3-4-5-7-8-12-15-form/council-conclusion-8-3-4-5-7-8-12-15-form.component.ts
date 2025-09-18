import {Component} from '@angular/core';
import {isEmptyOrNull} from "@app/support/utils";
import {CouncilConclusion_8_1_2_FormComponent} from "@app/components/document-form/council-conclusion-8-1-2-form/council-conclusion-8-1-2-form.component";

@Component({
  selector: 'app-council-conclusion-8-3-4-5-7-8-12-15-form',
  templateUrl: './council-conclusion-8-3-4-5-7-8-12-15-form.component.html'
})
export class CouncilConclusion_8_3_4_5_7_8_12_15_FormComponent extends CouncilConclusion_8_1_2_FormComponent {

  constructor() {
    super();
    this.financeConclusionNum = '9.4';
  }

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.marketingResearch)) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
  }

    showTarget8_1() {
        let is8_1 = false;
        // Использовал регулярные выражения, т.к. проверка возвращала true для 8.1 и 8.11, 8.12 и т.д.
        const regExp = /8.1(.*)/;
        const isDigit = /\d/;
        let code = this.project.code.code;
        if (code.startsWith('8.1')) {
            let regExpMatchArray = code.match(regExp);
            if (regExpMatchArray && regExpMatchArray[1]) {
                is8_1 = !isDigit.test(regExpMatchArray[1]);
            } else {
                is8_1 = true;
            }
        }
        return is8_1;
    }

    showTarget8_3() {
        return this.project.code.code.startsWith('8.3');
    }

    showTarget8_4() {
        return this.project.code.code.startsWith('8.4');
    }


    showTarget8_8() {
        return this.project.code.code.startsWith('8.8');
    }

    showTarget8_2() {
        return this.project.code.code.startsWith('8.2');
    }

    showTarget8_15() {
        return this.project.code.code.startsWith('8.15');
    }
}
