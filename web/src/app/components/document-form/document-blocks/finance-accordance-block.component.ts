import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";

@Component({
    selector: 'app-finance-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие заявленного финансирования планируемому объему выполняемых работ:
      </label>
      <app-boolean-button [(ngModel)]="_form.financeAccordance" [trueLabel]="'соответствует'"
                          [falseLabel]="'не соответствует'" 
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <ng-container *ngIf="!_form.financeAccordance">
        <label>Рекомендуемый объем финансирования, {{project?.currency?.name || 'руб.'}}:</label>
        <div class="input-group">
          <input [(ngModel)]="_form.financeSuggestion" min="0" numberInput type="text" class="form-control"
                 [title]="'Рекомендуемый объем финансирования, ' + (project?.currency?.name || 'руб.')"
                 [placeholder]="'сумма, ' + (project?.currency?.name || 'руб.')">
        </div>
      </ng-container>
      <textarea *ngIf="full" [(ngModel)]="_form.financeAccordanceText" rows="3" class="form-control mt-05"
                [attr.placeholder]="isTextRequired ? 'Обязательный текст.' : 'Пояснительный текст (при необходимости).'"></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Проведите анализ и оценку обоснованности расходов во внедряемые технологии по объекту государственной
          экспертизы. Обоснуйте расходы по сравнению с аналогичными технологиями и (или) продукцией, 
          применяемыми и (или) выпускаемой в Республике Беларусь и (или) мире.
          Оцените обоснованность расходов по соотношению себестоимости и стоимости продукции (работ и услуг).
        </p>
        <p>
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
          Если информация отсутствует, дайте свою экспертную оценку по данному вопросу.
          Оцените обоснованность расходов по соответствующим статьям себестоимости и стоимость продукции (работ и услуг).
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class FinanceAccordanceBlockComponent {

  @Input()
  num: string = "9.3";

  @Input()
  full: boolean = true;

  @Input()
  isTextRequired: boolean = false;

  @Input()
  _form: { financeAccordance: boolean, financeSuggestion: number, financeAccordanceText: string };

  @Input()
  project: ProjectPlainDto | ProjectDto;

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
