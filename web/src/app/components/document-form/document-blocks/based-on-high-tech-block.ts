import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EconomicActivityBlockComponent} from "@app/components/document-form/document-blocks/economic-activity-block";

@Component({
    selector: 'app-based-on-high-tech-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Производство товара на основе новых и высоких технологий и (или) с использованием высокотехнологичных производств:
      </label>
        <app-boolean-button [(ngModel)]="_form.basedOnHighTech" [trueLabel]="trueLabel"
                            [falseLabel]="falseLabel"
                            (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full || _form.basedOnHighTech" 
                [(ngModel)]="_form.basedOnHighTechText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
    </div>
  `
})
export class BasedOnHighTechBlockComponent {

    @Input()
    num: string = "9.2";

    @Input()
    full: boolean = true;
    @Input()
    trueLabel : string = "осуществляется";

    @Input()
    falseLabel : string = "не осуществляется";

    @Input()
    _form: { basedOnHighTech: boolean, basedOnHighTechText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
