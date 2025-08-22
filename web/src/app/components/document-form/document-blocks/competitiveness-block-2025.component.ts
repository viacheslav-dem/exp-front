import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'app-competitiveness-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Обоснование конкурентоспособности разработки:
      </label>
      <app-dropdown [options]="competitivenessOptions" [(ngModel)]="_form.competitiveness"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.competitivenessText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
            Для объектов государственной экспертизы, указанных в подпункте 8.4 пункта 8 Положения, 
            эксперт должен дополнительно оценить достаточность представленной оценки научно-технического уровня
            и конкурентоспособности разработки, соответствия экологическим
            и иным показателям, а также требованиям международных стандартов.
        </p>
          <p>
              Если в материалах по объекту государственной экспертизы отсутствует соответствующая информация, 
              эксперт должен указать в данном пункте заключения фразу: <b> «Не представлено в материалах по объекту государственной экспертизы».</b>
          </p>
      </div>
    </div>
  `
})
export class CompetitivenessBlock2025Component {

    competitivenessOptions: string[] = [
        'достаточно',
        'недостаточно',
    ];

    @Input()
    num: string = "6.1";

    @Input()
    full: boolean = true;

    @Input()
    _form: { competitiveness: string, competitivenessText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
