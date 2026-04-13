import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-catalog-high-tech-block',
    template: `
    <div class="form-sub-group" >
      <label>
        Отнесение товара к высокотехнологичному для его включения в перечень высокотехнологичных товаров:
      </label>
        <app-boolean-button name="catalogHighTech" required [ngModel]="_form()?.catalogHighTech" 
                            [trueLabel]="'возможно отнесение'"
                            [falseLabel]="'невозможно отнесение'"
                            [disabled]="disabled()"
                            (ngModelChange)="emitPatch({ catalogHighTech: $event })"></app-boolean-button>
    </div>
  `,
    standalone: false
})
export class CatalogHighTechBlockComponent {

    readonly _form = input<CatalogHighTechBlockForm>(undefined);

    readonly disabled = input<boolean>(false);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<CatalogHighTechBlockForm>>();

    emitPatch(patch: Partial<CatalogHighTechBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type CatalogHighTechBlockForm = {
  catalogHighTech: boolean;
};
