import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-competence-sufficiency-block-2025',
    template: `
        <div class="form-sub-group">
            <label>
                {{ num }}. Достаточность компетенции кадрового состава потенциального исполнителя работ:
            </label>
            <app-dropdown [options]="competenceSufficiencyOptions" [(ngModel)]="_form.competenceSufficiency"
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
            <textarea *ngIf="full" [(ngModel)]="_form.competenceSufficiencyText" rows="3" class="form-control mt-05"
                      placeholder="Обязательный текст"></textarea>
            <div *ngIf="full" class="hint">


                <div *ngIf="isExpertReview">
                    <p>
                        <b>Подсказка.</b>
                        Эксперт должен оценить наличие у исполнителя опыта решения задач, а также результатов работ,
                        полученных в рамках выполнения
                        государственных программ научных исследований и научно-технических программ, взятых за основу
                        для реализации объекта
                        государственной экспертизы, целесообразность проведения новых научных исследований с
                        обязательным указанием ссылок
                        на наименования документов и номера страниц, в которых приводится соответствующая информация по
                        представленным материалам
                        объекта государственной экспертизы; если в материалах по объекту государственной экспертизы
                        отсутствует соответствующая
                        информация, эксперт должен указать в данном пункте заключения фразу: «Не представлено в
                        материалах по объекту государственной экспертизы».
                    </p>
                </div>
                <div *ngIf="!isExpertReview">
                    <p>
                        <b>Подсказка.</b>
                        Оценивается наличие у потенциального исполнителя опыта решения задач, а также результатов работ,
                        полученных в рамках выполнения государственных программ научных исследований и
                        научно-технических программ, взятых за основу для реализации объекта государственной экспертизы,
                        целесообразности проведения новых научных исследований, а также наличия необходимых для
                        выполнения работ материальных и финансовых ресурсов.
                    </p>
                </div>

            </div>
        </div>
    `
})
export class CompetenceSufficiencyBlock2025Component {

    competenceSufficiencyOptions = competenceSufficiencyOptions;

    @Input()
    num: string = "5";

    @Input()
    full: boolean = true;

    @Input()
    _form: { competenceSufficiency: string, competenceSufficiencyText: string };

    @Input()
    isExpertReview: boolean = true;

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}

export const competenceSufficiencyOptions: string[] = [
    'достаточна',
    'недостаточна',
];