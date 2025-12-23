import {Component} from '@angular/core';
import {
    CouncilConclusion_8_1_2_FormComponent
} from "@app/components/document-form/council-conclusion-8-1-2-form/council-conclusion-8-1-2-form.component";
import {DataService} from "@app/services/data.service";

@Component({
    selector: 'app-council-conclusion-8-3-4-5-7-8-12-15-form',
    templateUrl: './council-conclusion-8-3-4-5-7-8-12-15-form.component.html',
    standalone: false
})
export class CouncilConclusion_8_3_4_5_7_8_12_15_FormComponent extends CouncilConclusion_8_1_2_FormComponent {

    noveltyOptions: string[] = [];

    constructor(private _dataService: DataService) {
        super();
        this.financeConclusionNum = '9.4';
    }

    ngOnInit() {
        this._dataService.getCommercializationMethods().subscribe(res => {
            res.forEach(option => this.noveltyOptions.push(option.name))
        })
    }

    validate() {
        // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
        // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
        super.validate();
        this.validateFinanceConclusion();
        // Проверка termsSuggestion и financeSuggestion оставлена через throw, так как это бизнес-логика
        this.validationCommentsOnConclusion();
    }

    showTarget8_1() {
        const code = this.project && this.project.code && this.project.code.code ? this.project.code.code : null;
        if (!code) {
            return false;
        }
        let is8_1 = false;
        // Использовал регулярные выражения, т.к. проверка возвращала true для 8.1 и 8.11, 8.12 и т.д.
        const regExp = /8.1(.*)/;
        const isDigit = /\d/;
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
        const code = this.project && this.project.code && this.project.code.code ? this.project.code.code : null;
        return !!code && code.startsWith('8.3');
    }

    showTarget8_4() {
        const code = this.project && this.project.code && this.project.code.code ? this.project.code.code : null;
        return !!code && code.startsWith('8.4');
    }


    showTarget8_8() {
        const code = this.project && this.project.code && this.project.code.code ? this.project.code.code : null;
        return !!code && code.startsWith('8.8');
    }

    showTarget8_2() {
        const code = this.project && this.project.code && this.project.code.code ? this.project.code.code : null;
        return !!code && code.startsWith('8.2');
    }

    showTarget8_15() {
        const code = this.project && this.project.code && this.project.code.code ? this.project.code.code : null;
        return !!code && code.startsWith('8.15');
    }



    private validationCommentsOnConclusion() {
        // Проверка termsSuggestion и financeSuggestion оставлена через throw, так как это бизнес-логика, не связанная с template-driven валидацией
        if (!this._form.termsAccordance && (this._form.termsSuggestion.start == undefined || this._form.termsSuggestion.end == undefined)) {
            throw "В пункте 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' не проставлены рекомендуемые сроки реализации."
        }
        if (!this._form.financeAccordance && (this._form.financeSuggestion < 0 || this._form.financeSuggestion == undefined)) {
            throw "В пункте 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' рекомендуемый объем финансирования финансирования не может быть меньше нуля.";
        }
    }
}
