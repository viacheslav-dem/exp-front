import {Component, EventEmitter, Output, input} from '@angular/core';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-risks-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Риски реализации проекта:
      </label>
      <app-dropdown name="risks" required [options]="risksOptions" [(ngModel)]="_form().risks"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().risksText"
          [attr.name]="'risksText_' + num().split('.').join('_')"
          required
          minlength="30"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
      @if (full()) {
        <div class="hint">
          <div>
            <b>Подсказка.</b>
            @if (_project().code.expertReviewType == 'EXPERT_REVIEW_8_1_2_15_2025'
              || _project().code.expertReviewType == 'EXPERT_REVIEW_8_3_4_12NIOKTR_2025') {
              <div>
                Эксперт должен провести анализ способов и методов оценки результативности и эффективности реализации объекта
                государственной экспертизы рисков, сопутствующих объекту государственной экспертизы с обязательным указанием ссылок
                на наименования документов и номера страниц, в которых приводится соответствующая информация по представленным
                материалам объекта государственной экспертизы и сделать вывод о высоких/низких рисках реализации проекта;
                если в материалах по объекту государственной экспертизы отсутствует соответствующая информация,
                эксперт должен указать в данном пункте заключения фразу: «Не представлено в материалах по объекту государственной экспертизы».
              </div>
            }
            @if (_project().code.expertReviewType == 'EXPERT_REVIEW_8_5_7_8_12IP_2025') {
              <div>
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
            }
          </div>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class RisksBlock2025Component {

    risksOptions: string[] = [
        'низкие',
        'высокие',
    ];

    readonly num = input<string>("7");

    readonly full = input<boolean>(true);

    readonly _project = input<ProjectPlainDto | ProjectDto>(undefined);

    readonly _form = input<{
    risks: string;
    risksText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}