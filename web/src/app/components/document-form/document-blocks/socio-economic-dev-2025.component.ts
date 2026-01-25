import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-socio-economic-dev-2025',
    template: `
        <div class="form-sub-group">
          <label>
            {{num()}}. Соответствие объекта государственной экспертизы заявленным целям:
          </label>
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().socioEconomic === true}" (click)="stateButton(true)">
              Соответствует
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().socioEconomic === false}" (click)="stateButton(false)">
              Не соответствует
            </button>
          </div>
          @if (full()) {
            <textarea
              [ngModel]="_form().socioEconomicText"
              (ngModelChange)="emitPatch({ socioEconomicText: $event })"
              rows="3"
              class="form-control mt-05"
              placeholder="Обязательный текст"
            ></textarea>
          }
        </div>
        `,
    standalone: false
})
export class SocioEconomivDev2025Component {

    readonly num = input<string>("10.6");

    readonly full = input<boolean>(true);

    readonly _form = input<SocioEconomicDev2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<SocioEconomicDev2025Form>>();

    emitPatch(patch: Partial<SocioEconomicDev2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    stateButton(flag: boolean) {
        this.emitPatch({ socioEconomic: flag });
    }
}

type SocioEconomicDev2025Form = {
    socioEconomic: boolean;
    socioEconomicText: string;
};
