import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-target-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка целевых показателей проекта:
      </label>
      <app-dropdown name="target" required [options]="targetOptions" [(ngModel)]="_form().target"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full()) {
        <textarea [(ngModel)]="_form().targetText" name="targetText" required minlength="30" maxlength="5000" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)"></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Эксперт должен указать наличие и суть целевых показателей проекта с обязательным указанием ссылок на наименования документов и номера страниц,
            в которых приводится соответствующая информация по представленным материалам объекта государственной экспертизы; если в материалах
            по объекту государственной экспертизы отсутствует соответствующая информация, эксперт должен указать в данном пункте заключения фразу:
            «Не представлено в материалах по объекту государственной экспертизы».
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class TargetBlock2025Component {

    targetOptions: string[] = [
        'достаточна',
        'недостаточна',
    ];

    readonly num = input<string>("3.1");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    target: string;
    targetText: string;
}>(undefined);

    readonly onConditionsChanged = output<boolean>();
}
