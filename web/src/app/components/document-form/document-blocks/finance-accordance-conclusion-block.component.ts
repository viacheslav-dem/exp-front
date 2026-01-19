import {Component, input, output} from '@angular/core';
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";

@Component({
    selector: 'app-finance-accordance-conclusion-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие заявленного финансирования планируемому объему выполняемых работ:
      </label>
      <app-boolean-button name="financeAccordance" required [(ngModel)]="_form().financeAccordance" [trueLabel]="'соответствует'"
                          [falseLabel]="'не соответствует'" 
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
        <div class="form-sub-group">
            <label>
                Обоснованность расходов по сравнению с аналогичными технологиями и (или) продукцией,
                применяемыми и (или) выпускаемой в Республике Беларусь и (или) мире:
            </label>
            <textarea [(ngModel)]="_form().financeValidity" name="financeValidity" rows="3" class="form-control"
                      placeholder="анализ и оценка обоснованности расходов во внедряемые технологии по объекту экспертизы">
    </textarea>
        </div>
    </div>
  `,
    standalone: false
})
export class FinanceAccordanceConclusionBlockComponent {

    readonly num = input<string>("9.3");

    readonly full = input<boolean>(true);

    readonly isTextRequired = input<boolean>(false);

    readonly _form = input<{
    financeAccordance: boolean;
    financeValidity: string;
}>(undefined);

    readonly onConditionsChanged = output<boolean>();
}
