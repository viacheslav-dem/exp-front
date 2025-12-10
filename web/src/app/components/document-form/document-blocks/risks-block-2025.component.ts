import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-risks-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Риски реализации проекта:
      </label>
      <app-dropdown [options]="risksOptions" [(ngModel)]="_form.risks"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.risksText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div *ngIf="full" class="hint">
        <div>
          <b>Подсказка.</b>
            <div *ngIf="_project.code.expertReviewType == 'EXPERT_REVIEW_8_1_2_15_2025' 
                   || _project.code.expertReviewType == 'EXPERT_REVIEW_8_3_4_12NIOKTR_2025'">
                Эксперт должен провести анализ способов и методов оценки результативности и эффективности реализации объекта 
                государственной экспертизы рисков, сопутствующих объекту государственной экспертизы с обязательным указанием ссылок 
                на наименования документов и номера страниц, в которых приводится соответствующая информация по представленным 
                материалам объекта государственной экспертизы и сделать вывод о высоких/низких рисках реализации проекта; 
                если в материалах по объекту государственной экспертизы отсутствует соответствующая информация, 
                эксперт должен указать в данном пункте заключения фразу: «Не представлено в материалах по объекту государственной экспертизы».
            </div>
            <div *ngIf="_project.code.expertReviewType == 'EXPERT_REVIEW_8_5_7_8_12IP_2025'">
                <p>
                    Оцениваются:
                </p>
                <ul>
                    <li>
                        сбытовые риски (изменение цен, конкуренция на одном или нескольких рынках);
                    </li>
                    <li>
                        финансовые риски;
                    </li>
                    <li>
                        риски, связанные с использованием интеллектуальной собственности, изменением законодательства, неполучением финансирования 
                        по объекту государственной экспертизы, введением государственных санкций или установлением таможенных барьеров
                        и другие возможные риски, даже если в материалах по объекту государственной экспертизы отсутствует соответствующая информация.
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  `,
    standalone: false
})
export class RisksBlock2025Component {

    risksOptions: string[] = [
        'низкие',
        'высокие',
    ];

    @Input()
    num: string = "7";

    @Input()
    full: boolean = true;

    @Input()
    _project: ProjectPlainDto | ProjectDto;

    @Input()
    _form: { risks: string, risksText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}