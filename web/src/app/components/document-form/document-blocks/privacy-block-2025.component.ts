import {Component, EventEmitter, Output, input} from '@angular/core';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-privacy-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Создание объекта права промышленной собственности
        @if (_project().code.expertReviewType != 'EXPERT_REVIEW_8_14_2025') {
          <label>при реализации объекта государственной экспертизы</label>
          }:
        </label>
        <app-dropdown name="privacyObjectsDescription" required [options]="privacyOptions" [(ngModel)]="_form().privacyObjectsDescription"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
        @if (full() || _form().privacyObjectsDescription == 'предусматривается') {
          <textarea
            [(ngModel)]="_form().privacyObjectsDescriptionText"
            [attr.name]="'privacyObjectsDescriptionText_' + num().split('.').join('_')"
            required
            minlength="30"
            maxlength="5000"
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
                  Эксперт указывает объекты права промышленной собственности, создание которых предусматривается объектом государственной
                  экспертизы с обязательным указанием ссылок на наименования документов и номера страниц, в которых приводится
                  соответствующая информация в соответствии с материалами по объекту государственной экспертизы; если таких объектов права нет,
                  эксперт должен указать в данном пункте заключения фразу: «Не предусматривается в соответствии с материалами по объекту государственной экспертизы».
                </div>
              }
              @if (_project().code.expertReviewType == 'EXPERT_REVIEW_8_5_7_8_12IP_2025') {
                <div>
                  Если в материалах по объекту государственной экспертизы отсутствует соответствующая информация, эксперт должен указать:
                  «не представлено в материалах по объекту государственной экспертизы» и дать свою экспертную оценку по данному вопросу.
                </div>
              }
              @if (_project().code.expertReviewType == 'EXPERT_REVIEW_8_14_2025') {
                <div>
                  Если в материалах по объекту государственной экспертизы отсутствует соответствующая информация, эксперт должен указать:
                  «не представлено в материалах по объекту государственной экспертизы» и дать свою экспертную оценку по данному вопросу.
                </div>
              }
            </div>
          </div>
        }
      </div>
    `,
    standalone: false
})
export class PrivacyBlock2025Component {

    privacyOptions: string[] = [
        'предусматривается',
        'не предусматривается',
    ];

    readonly num = input<string>("8");

    readonly full = input<boolean>(true);

    readonly _project = input<ProjectPlainDto | ProjectDto>(undefined);

    readonly _form = input<{
    privacyObjectsDescription: string;
    privacyObjectsDescriptionText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}