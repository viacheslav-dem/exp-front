import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-scientific-level-of-injected-tech-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Научно-технический уровень внедряемых технологий
      </label>
        <br/>
        <app-boolean-button [(ngModel)]="_form.scientificLevelOfInjectedTech" [trueLabel]="'подтверждается'"
                            [falseLabel]="'не подтверждается'"
                            (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
        <div *ngIf="full" class="hint">
            <p>
                <b>Подсказка.</b>
                Научно-технический уровень внедряемых технологий может подтверждаться наличием:
                патентов на объекты права промышленной собственности, полученных в Республике Беларусь и за рубежом
                (решений патентных органов о выдаче патентов); имущественных прав на секреты производства (ноу-хау),
                относящиеся к продукту и (или) способу; исключительных прав на программное обеспечение;
                лицензионных договоров на предоставление права использования результатов интеллектуальной деятельности,
                договоров на передачу секретов производства (ноу-хау), относящихся к продукту и (или) к способу.
            </p>
        </div>
    </div>
  `
})
export class ScientificLevelOfInjectedTechBlockComponent {

    @Input()
    num: string = "1.1";

    @Input()
    full: boolean = true;

    @Input()
    _form: { scientificLevelOfInjectedTech: string };
    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
