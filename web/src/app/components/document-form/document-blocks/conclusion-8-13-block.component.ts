import {Component, EventEmitter, Input, Output} from '@angular/core';

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
        [(ngModel)]="_form.conclusion"
        [disabled]="disabled"
        [showDisabledSelection]="true"
        [trueLabel]="'целесообразно'"
        [falseLabel]="'нецелесообразно'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea [(ngModel)]="_form.conclusionText" rows="3" class="form-control mt-05"
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

  @Input()
  disabled: boolean = false;

  @Input()
  _form: { conclusion: boolean, conclusionText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
