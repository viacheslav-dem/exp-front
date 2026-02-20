import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-scientific-level-of-injected-tech-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Научно-технический уровень внедряемых технологий
      </label>
      <br/>
      <input type="hidden" [ngModel]="_form()?.scientificLevelOfInjectedTech" name="scientificLevelOfInjectedTech" required>
      <app-boolean-button name="scientificLevelOfInjectedTech" required [ngModel]="_form()?.scientificLevelOfInjectedTech" [trueLabel]="'подтверждается'"
        [falseLabel]="'не подтверждается'"
      (ngModelChange)="emitPatch({ scientificLevelOfInjectedTech: $event })"></app-boolean-button>
      @if (full()) {
        <div class="hint">
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
      }
    </div>
    `,
    standalone: false
})
export class ScientificLevelOfInjectedTechBlockComponent {

    readonly num = input<string>("1.1");

    readonly full = input<boolean>(true);

    readonly _form = input<ScientificLevelOfInjectedTechBlockForm>(undefined);
    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<ScientificLevelOfInjectedTechBlockForm>>();

    emitPatch(patch: Partial<ScientificLevelOfInjectedTechBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type ScientificLevelOfInjectedTechBlockForm = {
  scientificLevelOfInjectedTech: boolean;
};
