import {Component} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
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
        this._dataService.getCommercializationMethods().pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(res => {
            res.forEach(option => this.noveltyOptions.push(option.name))
        })
    }

    validate() {
        super.validate();
        this.validateFinanceConclusion();
        const form = this.formValue();
        if (!form.nameAccordance && isEmptyOrNull(form.nameSuggestion)) {
            throw "В пункте 11.1: 'Соответствие объекта государственной экспертизы своему наименованию.' рекомендуемое наименование не введено.";
        }
        if (!form.termsAccordance && (form.termsSuggestion?.start == undefined || form.termsSuggestion?.end == undefined)) {
            throw "В пункте 11.2: 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' не проставлены рекомендуемые сроки реализации.";
        }
        if (!form.financeAccordance && (form.financeSuggestion < 0 || form.financeSuggestion == undefined)) {
            throw "В пункте 11.3: 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' рекомендуемый объем финансирования финансирования не может быть меньше нуля.";
        }
    }

    isFinanceConclusionDisabled() {
        const form = this.formValue();
        return !anyMatch(form.novelty, 'новый для Республики Беларусь', 'новый для стран СНГ', 'новизна мирового уровня')
            || !anyMatch(form.economicSignificance, 'средняя', 'высокая');
    }

    onConditionsChanged() {
        this.markFormChanged();
        if (this.isFinanceConclusionDisabled()) {
            this.patchForm({ financeConclusion: false });
        }
    }
}
