import {Component, input, output} from "@angular/core";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-scientific-research-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Вид научного исследования:
      </label>
      @if (showTarget8_3() || showTarget8_4()) {
        <app-dropdown
          name="scientificResearch"
          required
          [options]="scientificResearchOptions2"
          [ngModel]="_form().scientificResearch"
          (ngModelChange)="emitPatch({ scientificResearch: $event })"
        ></app-dropdown>
      }
      @if (!(showTarget8_3() || showTarget8_4())) {
        <app-dropdown
          name="scientificResearch"
          required
          [options]="scientificResearchOptions"
          [ngModel]="_form().scientificResearch"
          (ngModelChange)="emitPatch({ scientificResearch: $event })"
        ></app-dropdown>
      }
      @if (full()) {
        <textarea
          [ngModel]="_form().scientificResearchText"
          (ngModelChange)="emitPatch({ scientificResearchText: $event })"
          name="scientificResearchText"
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
            ОКР / ОТР (для объектов государственной экспертизы, указанных в подпунктах 8.3 и 8.4 пункта 8 Положения).
          </p>
          <p>
            Эксперт оценивает соответствие вида научного исследования (фундаментальное или прикладное) требованиям законодательства
            в сферах научной и научно-технической деятельности (Законы Республики Беларусь от 21 октября 1996 г. № 708-XIII «О научной
            деятельности» и от 19 января 1993 г. № 2105-XІІ «Об основах государственной научно-технической политики»),
            СТБ 1080-2011 «Порядок выполнения научно-исследовательских, опытно-конструкторских и опытно-технологических
            работ по созданию научно-технической продукции», утвержденного постановлением Государственного комитета по
            стандартизации Республики Беларусь от 28 октября 2011 г. № 78, в том числе перечню результатов фундаментальных
            и прикладных исследований согласно приложению Л к СТБ 1080-2011.
          </p>
          @if (project()?.code?.code == '8.4') {
            <p>
              Для объектов государственной экспертизы, указанных в подпункте 8.4 пункта 8 Положения, дополнительно оценивается
              принципиальная новизна новшеств, разработка которых планируется к выполнению в рамках проекта, их научно-технический
              уровень и конкурентоспособность, соответствие экологическим и иным показателям, а также требованиям международных стандартов.
            </p>
          }
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ScientificResearchBlock2025Component {

    scientificResearchOptions = scientificResearchOptions;
    scientificResearchOptions2 = scientificResearchOptions2;

    readonly num = input<string>("1");

    readonly full = input<boolean>(true);

    readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

    readonly _form = input<ScientificResearchBlock2025Form>(undefined);

    readonly isTextRequired = input<boolean>(false);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<ScientificResearchBlock2025Form>>();

    emitPatch(patch: Partial<ScientificResearchBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    showTarget8_3() {
        const code = this.project()?.code?.code;
        return !!code && code.startsWith('8.3');
    }

    showTarget8_4() {
        const code = this.project()?.code?.code;
        return !!code && code.startsWith('8.4');
    }

}

type ScientificResearchBlock2025Form = {
    scientificResearch: string;
    scientificResearchText: string;
};

export const scientificResearchOptions: string[] = [
    'фундаментальное',
    'прикладное'
];

export const scientificResearchOptions2: string[] = [
    'фундаментальное',
    'прикладное',
    'ОКР',
    'ОТР'
];
