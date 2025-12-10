import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-novelty-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Новизна (инновационность) объекта государственной экспертизы.
      </label>
      <label>
         Степень новизны (уровень инновационности) объекта государственной экспертизы:
      </label>
      <app-dropdown [options]="noveltyOptions" [(ngModel)]="_form.novelty"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.noveltyText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
            Оценивается степень соответствия объекта государственной экспертизы современному уровню научных знаний, 
            а также степень новизны целей и (или) методов проведения планируемых фундаментальных и прикладных научных исследований.
        </p>
          <div *ngIf="project && project.code && project.code.expertReviewType == 'EXPERT_REVIEW_8_3_4_12NIOKTR_2025'">
              Для объектов государственной экспертизы, указанных в подпункте 8.4 пункта 8 Положения, дополнительно оценивается 
              принципиальная новизна новшеств, разработка которых планируется к выполнению в рамках проекта, их научно-технический 
              уровень и конкурентоспособность, соответствие экологическим и иным показателям, а также требованиям международных стандартов.
          </div>
      </div>
    </div>
  `,
    standalone: false
})
export class NoveltyBlock2025Component {

    noveltyOptions = noveltyOptions;

    @Input()
    num: string = "1";

    @Input()
    full: boolean = true;

    @Input()
    project: ProjectPlainDto | ProjectDto;

    @Input()
    _form: { novelty: string, noveltyText: string };

    @Input()
    isTextRequired: boolean = false;

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}

export const noveltyOptions: string[] = [
    'не является новым для Республики Беларусь',
    'новый для Республики Беларусь',
    'новый для стран СНГ',
    'новизна мирового уровня'
];