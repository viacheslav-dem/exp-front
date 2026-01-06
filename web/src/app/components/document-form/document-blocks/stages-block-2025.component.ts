import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-stages-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{ num() }}. Наличие в календарном плане этапов реализации объекта государственной экспертизы, подлежащих
        государственной
        регистрации в соответствии с законодательством Республики Беларусь:
      </label>
      <input type="hidden" [(ngModel)]="_form().stages" name="stages" required>
      <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().stages === true}"
        (click)="stateButton(true)">
        Имеются
      </button>
      <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().stages === false}"
        (click)="stateButton(false)">
        Не имеются
      </button>
    
      @if (full() || _form().stages) {
        <textarea [(ngModel)]="_form().stagesText" name="stagesText" required minlength="30" maxlength="5000" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)."></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            При наличии в календарном плане этапов, подлежащих
            государственной регистрации, перечисляются номера данных этапов.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class StagesBlock2025Component {

  readonly num = input<string>('19.1');

  readonly full = input<boolean>(true);

  readonly _form = input<{
    stages: boolean;
    stagesText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  stateButton(flag: boolean) {
    this._form().stages = flag;
  }

}
