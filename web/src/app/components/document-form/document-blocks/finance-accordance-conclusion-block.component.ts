import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";

@Component({
    selector: 'app-finance-accordance-conclusion-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие заявленного финансирования планируемому объему выполняемых работ:
      </label>
      <app-boolean-button [(ngModel)]="_form.financeAccordance" [trueLabel]="'соответствует'"
                          [falseLabel]="'не соответствует'" 
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
        <div class="form-sub-group">
            <label>
                Обоснованность расходов по сравнению с аналогичными технологиями и (или) продукцией,
                применяемыми и (или) выпускаемой в Республике Беларусь и (или) мире:
            </label>
            <textarea [(ngModel)]="_form.financeValidity" rows="3" class="form-control"
                      placeholder="анализ и оценка обоснованности расходов во внедряемые технологии по объекту экспертизы">
    </textarea>
        </div>
    </div>
  `
})
export class FinanceAccordanceConclusionBlockComponent {

    @Input()
    num: string = "9.3";

    @Input()
    full: boolean = true;

    @Input()
    isTextRequired: boolean = false;

    @Input()
    _form: { financeAccordance: boolean, financeValidity: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
