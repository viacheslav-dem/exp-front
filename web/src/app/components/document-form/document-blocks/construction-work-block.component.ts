import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-construction-work-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Необходимость осуществления работ в сфере строительной деятельности. Возведение, реконструкция,
          реставрация, капитальный ремонт, техническая модернизация зданий и сооружений, их благоустройство:
      </label>
      <app-boolean-button [(ngModel)]="_form.constructionWorks" [trueLabel]="'требуется'"
                          [falseLabel]="'не требуется'"
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.constructionWorksText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>

        <div *ngIf="full" class="hint">
            <p>
                <b>Подсказка.</b>
                Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация, 
                или сделайте пометку "не представлено в материалах по обькту государственной экспертизы". 
                Если информация отсутствует, дайте свою экспертную оценку по данному вопросу.
            </p>
        </div>
    </div>
  `,
    standalone: false
})
export class ConstructionWorkBlockComponent {

    @Input()
    num: string = "3";

    @Input()
    full: boolean = true;

    @Input()
    _form: { constructionWorks: boolean, constructionWorksText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}