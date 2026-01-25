import {Component, input, output} from '@angular/core';
import {EconomicActivityBlockComponent} from "@app/components/document-form/document-blocks/economic-activity-block";

@Component({
    selector: 'app-based-on-high-tech-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Производство товара на основе новых и высоких технологий и (или) с использованием высокотехнологичных производств:
      </label>
      <input type="hidden" [ngModel]="_form()?.basedOnHighTech" name="basedOnHighTech" required>
      <app-boolean-button [ngModel]="_form()?.basedOnHighTech" [trueLabel]="trueLabel()"
        [falseLabel]="falseLabel()"
      (ngModelChange)="emitPatch({ basedOnHighTech: $event })"></app-boolean-button>
      @if (full() || _form()?.basedOnHighTech) {
        <textarea
          [ngModel]="_form()?.basedOnHighTechText"
          (ngModelChange)="emitPatch({ basedOnHighTechText: $event })"
          [attr.name]="'basedOnHighTechText_' + num().split('.').join('_')"
          required
          minlength="30"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
    </div>
    `,
    standalone: false
})
export class BasedOnHighTechBlockComponent {

    readonly num = input<string>("9.2");

    readonly full = input<boolean>(true);
    readonly trueLabel = input<string>("осуществляется");

    readonly falseLabel = input<string>("не осуществляется");

    readonly _form = input<BasedOnHighTechBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<BasedOnHighTechBlockForm>>();

    emitPatch(patch: Partial<BasedOnHighTechBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type BasedOnHighTechBlockForm = {
  basedOnHighTech: boolean;
  basedOnHighTechText: string;
};
