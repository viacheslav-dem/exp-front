import {Component, Input} from "@angular/core";

@Component({
    selector: 'app-export-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Экспортная ориентированность инновационного проекта (превышение экспорта над импортом):
      </label>
        <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form.balance > 0}">
                Да
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form.balance <= 0}">
                Нет
            </button>
        </div>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
            Эксперт должен сделать вывод об экспортной ориентированности проекта; если в настоящем заключении значение в подпункте 8.2.4 больше нуля, 
            то проект признается экспортоориентированным, если менее или равно, то нет.
        </p>
      </div>
    </div>
  `
})
export class ExportBlock2025Component {

    @Input()
    num: string = "2.5";

    @Input()
    full: boolean = true;

    @Input()
    _form: { balance: number };

}