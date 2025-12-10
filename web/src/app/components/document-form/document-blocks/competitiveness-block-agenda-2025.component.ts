import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'app-competitiveness-block-agenda-2025',
    template: `
        <div class="form-sub-group">
            <label>
                {{ num }}. Обоснование конкурентоспособности разработки:
            </label>
            <br>
            <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-outline-success"
                        [ngClass]="{'active': _form.competitiveness === true}" (click)="stateButton(true)">
                    достаточно
                </button>
                <button type="button" class="btn btn-outline-danger"
                        [ngClass]="{'active': _form.competitiveness === false}" (click)="stateButton(false)">
                    недостаточно
                </button>
            </div>
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
                    эксперт должен указать в данном пункте заключения фразу: <b> «Не представлено в материалах по
                    объекту государственной экспертизы».</b>
                </p>
            </div>
        </div>
    `,
    standalone: false
})
export class CompetitivenessBlockAgenda2025Component {

    @Input()
    num: string = "6.1";

    @Input()
    full: boolean = true;

    @Input()
    _form: { competitiveness: boolean, competitivenessText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean) {
        this._form.competitiveness = flag;
    }
}
