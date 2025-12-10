import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-stages-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{ num }}. Наличие в календарном плане этапов реализации объекта государственной экспертизы, подлежащих
        государственной
        регистрации в соответствии с законодательством Республики Беларусь:
      </label>
      <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form.stages === true}"
              (click)="stateButton(true)">
        Имеются
      </button>
      <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form.stages === false}"
              (click)="stateButton(false)">
        Не имеются
      </button>

      <textarea *ngIf="full || _form.stages" [(ngModel)]="_form.stagesText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          При наличии в календарном плане этапов, подлежащих
          государственной регистрации, перечисляются номера данных этапов.
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class StagesBlock2025Component {

  @Input()
  num: string = '19.1';

  @Input()
  full: boolean = true;

  @Input()
  _form: { stages: boolean, stagesText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  stateButton(flag: boolean) {
    this._form.stages = flag;
  }

}
