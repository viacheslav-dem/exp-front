import {Component, EventEmitter, Output, input} from '@angular/core';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-novelty-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Новизна (инновационность) объекта государственной экспертизы.
      </label>
      <label>
        Степень новизны (уровень инновационности) объекта государственной экспертизы:
      </label>
      <app-dropdown name="novelty" required [options]="noveltyOptions" [(ngModel)]="_form().novelty"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().noveltyText"
          [attr.name]="'noveltyText_' + num()"
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
          <p>
            <b>Подсказка.</b>
            Оценивается степень соответствия объекта государственной экспертизы современному уровню научных знаний,
            а также степень новизны целей и (или) методов проведения планируемых фундаментальных и прикладных научных исследований.
          </p>
          @if (project() && project().code && project().code.expertReviewType == 'EXPERT_REVIEW_8_3_4_12NIOKTR_2025') {
            <div>
              Для объектов государственной экспертизы, указанных в подпункте 8.4 пункта 8 Положения, дополнительно оценивается
              принципиальная новизна новшеств, разработка которых планируется к выполнению в рамках проекта, их научно-технический
              уровень и конкурентоспособность, соответствие экологическим и иным показателям, а также требованиям международных стандартов.
            </div>
          }
        </div>
      }
    </div>
    `,
    standalone: false
})
export class NoveltyBlock2025Component {

    noveltyOptions = noveltyOptions;

    readonly num = input<string>("1");

    readonly full = input<boolean>(true);

    readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

    readonly _form = input<{
    novelty: string;
    noveltyText: string;
}>(undefined);

    readonly isTextRequired = input<boolean>(false);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}

export const noveltyOptions: string[] = [
    'не является новым для Республики Беларусь',
    'новый для Республики Беларусь',
    'новый для стран СНГ',
    'новизна мирового уровня'
];