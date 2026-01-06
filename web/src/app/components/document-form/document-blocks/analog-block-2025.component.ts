import {Component, EventEmitter, Output, input} from "@angular/core";

@Component({
    selector: 'app-analog-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Направленность объекта государственной экспертизы:
      </label>
      <app-dropdown name="analog" required [options]="analogOptions" [(ngModel)]="_form().analog"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full()) {
        <textarea [(ngModel)]="_form().analogText" name="analogText" required minlength="30" maxlength="5000" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)"></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Для объектов государственной экспертизы, указанных в подпункте 8.4 пункта 8 Положения, эксперт дополнительно указывает, что
            в результате реализации проекта планируется: <b>создание и (или) освоение новых технологий</b> и (или) <b>видов продукции</b> (работ, услуг);
            <b>улучшение технико-экономических параметров</b> применяемых технологий и (или) производимой продукции (работ, услуг),
            обеспечивающих их конкурентоспособность на мировом рынке; развитие <b> фундаментальных научных знаний</b> и <b>перспективных способов
            их применения</b>, получение <b>социального эффекта</b>.
          </p>
          <p>
            Если в материалах по объекту государственной экспертизы отсутствует соответствующая информация,
            эксперт должен указать в данном пункте заключения фразу: <b> «Не представлено в материалах по объекту государственной экспертизы».</b>
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class AnalogBlock2025Component {

    analogOptions: string[] = [
        'на создание новшества',
        'на создание полного аналога импортируемой продукции',
    ];

    readonly num = input<string>("5.2");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    analog: string;
    analogText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}