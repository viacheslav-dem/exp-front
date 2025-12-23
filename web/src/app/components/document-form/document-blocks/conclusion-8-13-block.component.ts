import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-conclusion-8-13-block',
    template: `
    <div class="form-group">

      <label class="font-weight-bold">
        Заключение эксперта по объекту государственной экспертизы
      </label>

      <label>
        Целесообразность реализации объекта государственной экспертизы:
      </label>
      <app-boolean-button
        name="conclusion"
        required
        [(ngModel)]="_form().conclusion"
        [disabled]="disabled()"
        [showDisabledSelection]="true"
        [trueLabel]="'целесообразно'"
        [falseLabel]="'нецелесообразно'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea
        [(ngModel)]="_form().conclusionText"
        [attr.name]="'conclusionText_8_13'"
        required
        minlength="30"
        rows="3"
        class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div class="hint">
        <p>
          <b>Подсказка.</b>
          Решение о <b>целесообразности</b> реализации объекта экспертизы принимается только
          при <b>соответствии</b> (<b>достаточности</b>)
          объекта государственной экспертизы всем требованиям выше.
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class Conclusion_8_13_BlockComponent {

  readonly disabled = input<boolean>(false);

  readonly _form = input<{
    conclusion: boolean;
    conclusionText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
