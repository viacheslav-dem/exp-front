import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-privacy-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
          {{num}}. Создание объекта права промышленной собственности 
          <label *ngIf="_project.code.expertReviewType != 'EXPERT_REVIEW_8_14_2025'">при реализации объекта государственной экспертизы</label>:
      </label>
      <app-dropdown [options]="privacyOptions" [(ngModel)]="_form.privacyObjectsDescription"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full || _form.privacyObjectsDescription == 'предусматривается'" 
                [(ngModel)]="_form.privacyObjectsDescriptionText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div *ngIf="full" class="hint">
          <div>
              <b>Подсказка.</b>
              <div *ngIf="_project.code.expertReviewType == 'EXPERT_REVIEW_8_1_2_15_2025' 
                   || _project.code.expertReviewType == 'EXPERT_REVIEW_8_3_4_12NIOKTR_2025'">
                  Эксперт указывает объекты права промышленной собственности, создание которых предусматривается объектом государственной
                  экспертизы с обязательным указанием ссылок на наименования документов и номера страниц, в которых приводится
                  соответствующая информация в соответствии с материалами по объекту государственной экспертизы; если таких объектов права нет,
                  эксперт должен указать в данном пункте заключения фразу: «Не предусматривается в соответствии с материалами по объекту государственной экспертизы».
              </div>
              <div *ngIf="_project.code.expertReviewType == 'EXPERT_REVIEW_8_5_7_8_12IP_2025'">
                  Если в материалах по объекту государственной экспертизы отсутствует соответствующая информация, эксперт должен указать: 
                  «не представлено в материалах по объекту государственной экспертизы» и дать свою экспертную оценку по данному вопросу.
              </div>
              <div *ngIf="_project.code.expertReviewType == 'EXPERT_REVIEW_8_14_2025'">
                  Если в материалах по объекту государственной экспертизы отсутствует соответствующая информация, эксперт должен указать:
                  «не представлено в материалах по объекту государственной экспертизы» и дать свою экспертную оценку по данному вопросу.
              </div>
          </div>
      </div>
    </div>
  `,
    standalone: false
})
export class PrivacyBlock2025Component {

    privacyOptions: string[] = [
        'предусматривается',
        'не предусматривается',
    ];

    @Input()
    num: string = "8";

    @Input()
    full: boolean = true;

    @Input()
    _project: ProjectPlainDto | ProjectDto;

    @Input()
    _form: { privacyObjectsDescription: string, privacyObjectsDescriptionText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}