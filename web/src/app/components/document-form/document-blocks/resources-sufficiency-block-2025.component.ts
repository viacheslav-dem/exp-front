import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-resources-sufficiency-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Достаточность материально-технической базы и кадрового потенциала исполнителя работ:
      </label>
      <app-dropdown [options]="resourcesSufficiencyOptions" [(ngModel)]="_form.resourcesSufficiency"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.resourcesSufficiencyText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
            Эксперт должен оценить достаточность имеющейся научной, конструкторско-технологической и производственной, 
            в том числе лабораторной и опытно-исследовательской базы и метрологического обеспечения исполнителя проекта, 
            кадрового потенциала, включая численность сотрудников, привлекаемых для реализации данных работ, обеспеченности 
            трудовыми ресурсами соответствующей квалификации, а также наличие необходимых для выполнения работ материальных и 
            финансовых ресурсов с обязательным указанием ссылок на наименования документов и номера страниц, в которых приводится 
            соответствующая информация по представленным материалам объекта государственной экспертизы; если в материалах по объекту 
            государственной экспертизы отсутствует соответствующая информация, эксперт должен указать в данном пункте заключения фразу: 
            «Не представлено в материалах по объекту государственной экспертизы».
        </p>
      </div>
    </div>
  `
})
export class ResourcesSufficiencyBlock2025Component {

    resourcesSufficiencyOptions = resourcesSufficiencyOptions;

    @Input()
    num: string = "4";

    @Input()
    full: boolean = true;

    @Input()
    _form: { resourcesSufficiency: string, resourcesSufficiencyText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}

export const resourcesSufficiencyOptions: string[] = [
    'достаточна',
    'недостаточна',
];