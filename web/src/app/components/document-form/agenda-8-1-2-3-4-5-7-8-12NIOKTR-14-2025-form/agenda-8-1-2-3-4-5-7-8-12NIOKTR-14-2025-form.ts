import {Component} from '@angular/core';
import {anyMatch, isEmptyOrNull} from "@app/support/utils";
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";
import {DataService} from "@app/services/data.service";

@Component({
    selector: 'app-agenda-8-1-2-3-4-5-7-8-12NIOKTR-14-2025-form',
    templateUrl: './agenda-8-1-2-3-4-5-7-8-12NIOKTR-14-2025-form.html',
    standalone: false
})
export class Agenda_8_1_2_3_4_5_7_8_12NIOKTR_14_2025_FormComponent extends AgendaNewForm {

    noveltyOptions: string[] = [];

    constructor(private _dataService: DataService) {
        super();
        this.financeConclusionNum = '19.5';
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
        // Проверка nameSuggestion, termsSuggestion, financeSuggestion и sufficiencySuggestion оставлена через throw, так как это бизнес-логика
        if (!this._form.nameAccordance && isEmptyOrNull(this._form.nameSuggestion)) {
            throw "В пункте 19.1: 'Соответствие объекта государственной экспертизы своему наименованию.' рекомендуемое наименование не введено.";
        }
        if (!this._form.termsAccordance && (this._form.termsSuggestion.start == undefined || this._form.termsSuggestion.end == undefined)) {
            throw "В пункте 19.2: 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' не проставлены рекомендуемые сроки реализации.";
        }
        if (!this._form.financeAccordance && (this._form.financeSuggestion < 0 || this._form.financeSuggestion == undefined)) {
            throw "В пункте 19.4: 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' рекомендуемый объем финансирования финансирования не может быть меньше нуля.";
        }
        if (this.showTarget8_14()) {
            if (!this._form.sufficiency && isEmptyOrNull(this._form.sufficiencySuggestion)) {
                throw "В пункте 20.1: 'Достаточность запланированных этапов работ (услуг), создаваемого и приобретаемого программного обеспечения, технических средств и (или) комплексов программно-технических средств.' рекомендуемые добавления не введены."
            }
        }
    }

    isFinanceConclusionDisabled() {
        return !anyMatch(this._form.novelty, 'новый для Республики Беларусь', 'новый для стран СНГ', 'новизна мирового уровня')
            || !anyMatch(this._form.economicSignificance, 'средняя', 'высокая');
    }

    onConditionsChanged() {
        if (this.isFinanceConclusionDisabled()) {
            this._form.financeConclusion = false;
        }
    }

    showTarget8_1() {
        if (!this.project || !this.project.code || !this.project.code.code) {
            return false;
        }
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
        return !!(this.project && this.project.code && this.project.code.code && this.project.code.code.startsWith('8.3'));
    }

    showTarget8_4() {
        return !!(this.project && this.project.code && this.project.code.code && this.project.code.code.startsWith('8.4'));
    }

    showTargetNot8_4() {
        if (!this.project || !this.project.code || !this.project.code.code) {
            return false;
        }
        return !this.project.code.code.startsWith('8.4');
    }

    showTarget8_5() {
        return !!(this.project && this.project.code && this.project.code.code && this.project.code.code.startsWith('8.5'));
    }

    showTarget8_7() {
        return !!(this.project && this.project.code && this.project.code.code && this.project.code.code.startsWith('8.7'));
    }

    showTarget8_8() {
        return !!(this.project && this.project.code && this.project.code.code && this.project.code.code.startsWith('8.8'));
    }

    showTarget8_12() {
        return !!(this.project && this.project.code && this.project.code.code && this.project.code.code.startsWith('8.12'));
    }

    showTarget8_14() {
        return !!(this.project && this.project.code && this.project.code.code && this.project.code.code.startsWith('8.14'));
    }
}
