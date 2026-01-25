import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-technology-type-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Использование технологий V или VI технологических укладов:
      </label>
      <input type="hidden" [ngModel]="_form()?.technologyType5" name="technologyType5">
      <input type="hidden" [ngModel]="_form()?.technologyType6" name="technologyType6">
      <input type="hidden" [ngModel]="_form()?.technologyOtherType" name="technologyOtherType">
      <div>
        <span>V технологический уклад: </span>
        <div class="btn-group" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form()?.technologyType5 === true}" (click)="stateButtonTechnologyType5(true)">
            Да
          </button>
          <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form()?.technologyType5 === false}" (click)="stateButtonTechnologyType5(false)">
            Нет
          </button>
        </div>
      </div>
      <div>
        <span>VI технологический уклад: </span>
        <div class="btn-group" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form()?.technologyType6 === true}" (click)="stateButtonTechnologyType6(true)">
            Да
          </button>
          <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form()?.technologyType6 === false}" (click)="stateButtonTechnologyType6(false)">
            Нет
          </button>
        </div>
      </div>
      <div>
        <span>проект другого технологического уклада: </span>
        <div class="btn-group" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form()?.technologyOtherType === true}" (click)="stateButtonTechnologyOtherType(true)">
            Да
          </button>
          <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form()?.technologyOtherType === false}" (click)="stateButtonTechnologyOtherType(false)">
            Нет
          </button>
        </div>
      </div>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.technologyTypeText"
          (ngModelChange)="emitPatch({ technologyTypeText: $event })"
          [name]="'technologyTypeText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст"
        ></textarea>
      }
    </div>
    `,
    standalone: false
})
export class TechnologyTypeBlock2025Component {

    readonly num = input<string>("1.3");

    readonly full = input<boolean>(true);

    readonly _form = input<TechnologyTypeBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<TechnologyTypeBlock2025Form>>();

    emitPatch(patch: Partial<TechnologyTypeBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    stateButtonTechnologyType5(flag: boolean) {
        this.emitPatch({ technologyType5: flag });
    }

    stateButtonTechnologyType6(flag: boolean) {
        this.emitPatch({ technologyType6: flag });
    }

    stateButtonTechnologyOtherType(flag: boolean) {
        this.emitPatch({ technologyOtherType: flag });
    }

}

type TechnologyTypeBlock2025Form = {
    technologyType5: boolean;
    technologyType6: boolean;
    technologyOtherType: boolean;
    technologyTypeText: string;
};