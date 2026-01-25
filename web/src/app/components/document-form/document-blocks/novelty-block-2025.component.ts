import {Component, input, output} from '@angular/core';
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
      <app-dropdown
        name="novelty"
        required
        [options]="noveltyOptions"
        [ngModel]="_form()?.novelty"
        (ngModelChange)="emitPatch({ novelty: $event })"
      ></app-dropdown>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.noveltyText"
          (ngModelChange)="emitPatch({ noveltyText: $event })"
          [name]="'noveltyText_' + num()"
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

    readonly _form = input<NoveltyBlock2025Form>(undefined);

    readonly isTextRequired = input<boolean>(false);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<NoveltyBlock2025Form>>();

    emitPatch(patch: Partial<NoveltyBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }
}

type NoveltyBlock2025Form = {
    novelty: string;
    noveltyText: string;
};

export const noveltyOptions: string[] = [
    'не является новым для Республики Беларусь',
    'новый для Республики Беларусь',
    'новый для стран СНГ',
    'новизна мирового уровня'
];