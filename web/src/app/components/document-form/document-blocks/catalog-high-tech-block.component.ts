import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-catalog-high-tech-block',
    template: `
    <div class="form-sub-group" >
      <label>
        Отнесение товара к высокотехнологичному для его включения в перечень высокотехнологичных товаров:
      </label>
        <app-boolean-button [(ngModel)]="_form().catalogHighTech" 
                            [trueLabel]="'возможно отнесение'"
                            [falseLabel]="'невозможно отнесение'"
                            [disabled]="disabled()"
                            (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
    </div>
  `,
    standalone: false
})
export class CatalogHighTechBlockComponent {

    readonly _form = input<{
    catalogHighTech: boolean;
}>(undefined);

    readonly disabled = input<boolean>(false);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
