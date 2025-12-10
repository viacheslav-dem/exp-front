import {Component, EventEmitter, Input, Output} from "@angular/core";
import {IndustryDto} from "@app/dto/IndustryDto";
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-section-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Секция и подсекция основного вида экономической деятельности, которому соответствует
        планируемый к реализации инновационный проект:
      </label>
      <app-select-catalog [catalog]="Catalog.INDUSTRY" 
                          [optionToString]="sectionToString"
                          [(ngModel)]="_form.section" 
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-select-catalog>
      <div *ngIf="full" class="hint">
        <p>
          Пороговое значение валовой добавленной стоимости в расчете на одного занятого 
          по основным видам экономической деятельности в Европейском союзе: <b>{{_form.section?.addedValueBound || '-'}}</b> евро.
        </p>
      </div>
      <textarea [(ngModel)]="_form.sectionText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div class="hint">
        <p>
          <b>Подсказка.</b>
            Эксперт должен указать пороговое значение валовой добавленной стоимости в соответствии с приложением к Методическим рекомендациям 
            о порядке расчета и оценке соответствия критериям, установленным Указом Президента Республики Беларусь от 7 августа 2012 г. № 357, 
            утвержденным постановлением Министерства экономики Республики Беларусь и Государственного комитета по науке и технологиям 
            Республики Беларусь от 23 мая 2017 г. № 12/11, по объекту государственной экспертизы с обязательным указанием ссылок на наименования 
            документов и номера страниц, в которых приводится соответствующая информация по представленным материалам объекта государственной экспертизы; 
            если в материалах по объекту государственной экспертизы отсутствует соответствующая информация, 
            эксперт должен указать в данном пункте заключения фразу: «не представлено в материалах по объекту государственной экспертизы» 
            и дать свою экспертную оценку по данному вопросу.
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class SectionBlock2025Component {

    Catalog = Catalog;
    sectionToString = (section: IndustryDto) => section.code + " - " + section.name

    @Input()
    num: string = "2.1";

    @Input()
    full: boolean = true;

    @Input()
    _form: { section: IndustryDto, sectionText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
