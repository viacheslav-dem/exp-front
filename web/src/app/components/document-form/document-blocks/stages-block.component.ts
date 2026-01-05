import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-stages-block',
    template: `
        <div class="form-sub-group">
          <label>
            {{ num() }}. Наличие в календарном плане этапов реализации объекта государственной экспертизы, подлежащих
            государственной
            регистрации в соответствии с законодательством Республики Беларусь:
          </label>
          <app-boolean-button name="stages" required [(ngModel)]="_form().stages" [trueLabel]="'имеются'"
            [falseLabel]="'не имеются'"
          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
          @if (full() || _form().stages) {
            <textarea [(ngModel)]="_form().stagesText" name="stagesText" [attr.required]="isTextRequired() ? '' : null" [attr.minlength]="isTextRequired() ? '30' : null" rows="3" class="form-control mt-05"
            [attr.placeholder]="isTextRequired() ? 'Обязательный текст (не менее 30 символов).' : 'Пояснительный текст (при необходимости).'"></textarea>
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
export class StagesBlockComponent {

    readonly isTextRequired = input<boolean>(false);

    readonly num = input<string>('9.2');

    readonly full = input<boolean>(true);

    readonly _form = input<{
    stages: boolean;
    stagesText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
