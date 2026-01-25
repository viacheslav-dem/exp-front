import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-requirements-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Достаточность требований, предъявляемых к квалификации и опыту (компетенции) лиц, привлекаемых для выполнения работ
        (оказания услуг), а также к уровню производственной, научной, конструкторско-технологической базы, необходимой для реализации мероприятия:
      </label>
      <input type="hidden" [ngModel]="_form().requirements" name="requirements" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().requirements === true}" (click)="stateButton(true)">
          Достаточны
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().requirements === false}" (click)="stateButton(false)">
          Недостаточны
        </button>
      </div>
      @if (full()) {
        <textarea
          [ngModel]="_form().requirementsText"
          (ngModelChange)="emitPatch({ requirementsText: $event })"
          name="requirementsText"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
    </div>
    `,
    standalone: false
})
export class RequirementsBlock2025Component {

    readonly num = input<string>("8");

    readonly full = input<boolean>(true);

    readonly _form = input<RequirementsBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<RequirementsBlock2025Form>>();

    emitPatch(patch: Partial<RequirementsBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    stateButton(flag: boolean){
        this.emitPatch({ requirements: flag });
    }
}

type RequirementsBlock2025Form = {
    requirements: boolean;
    requirementsText: string;
};