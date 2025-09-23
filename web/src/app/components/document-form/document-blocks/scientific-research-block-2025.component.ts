import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-scientific-research-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Вид научного исследования:
      </label>
      <app-dropdown [options]="scientificResearchOptions" [(ngModel)]="_form.scientificResearch"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.scientificResearchText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="full" class="hint">
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
          <p *ngIf="project.code.code == '8.4'">
              Для объектов государственной экспертизы, указанных в подпункте 8.4 пункта 8 Положения, дополнительно оценивается 
              принципиальная новизна новшеств, разработка которых планируется к выполнению в рамках проекта, их научно-технический 
              уровень и конкурентоспособность, соответствие экологическим и иным показателям, а также требованиям международных стандартов.
          </p>
      </div>
    </div>
  `
})
export class ScientificResearchBlock2025Component {

    scientificResearchOptions = scientificResearchOptions;

    @Input()
    num: string = "1";

    @Input()
    full: boolean = true;

    @Input()
    project: ProjectPlainDto | ProjectDto;

    @Input()
    _form: { scientificResearch: string, scientificResearchText: string };

    @Input()
    isTextRequired: boolean = false;

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}

export const scientificResearchOptions: string[] = [
    'фундаментальное',
    'прикладное'
];