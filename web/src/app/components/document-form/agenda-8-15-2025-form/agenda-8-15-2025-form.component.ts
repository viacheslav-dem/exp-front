import {Component} from '@angular/core';
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";
import {anyMatch, isEmptyOrNull} from "@app/support/utils";
import {DataService} from "@app/services/data.service";

@Component({
    selector: 'app-agenda-8-15-2025-form',
    templateUrl: './agenda-8-15-2025-form.component.html',
    standalone: false
})
export class Agenda_8_15_2025FormComponent extends AgendaNewForm {

    noveltyOptions: string[] = [];

    constructor(private _dataService: DataService) {
        super();
        this.financeConclusionNum = '11.4';
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
        // Проверка nameSuggestion, termsSuggestion и financeSuggestion оставлена через throw, так как это бизнес-логика
        if (!this._form.nameAccordance && isEmptyOrNull(this._form.nameSuggestion)) {
            throw "В пункте 11.1: 'Соответствие объекта государственной экспертизы своему наименованию.' рекомендуемое наименование не введено.";
        }
        if (!this._form.termsAccordance && (this._form.termsSuggestion.start == undefined || this._form.termsSuggestion.end == undefined)) {
            throw "В пункте 11.2: 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' не проставлены рекомендуемые сроки реализации.";
        }
        if (!this._form.financeAccordance && (this._form.financeSuggestion < 0 || this._form.financeSuggestion == undefined)) {
            throw "В пункте 11.3: 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' рекомендуемый объем финансирования финансирования не может быть меньше нуля.";
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
}
