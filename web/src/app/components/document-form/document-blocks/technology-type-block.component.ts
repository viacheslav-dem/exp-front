import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-technology-type-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Использование технологий V или VI технологических укладов:
      </label>
      <div>
        <span>V технологический уклад: </span>
        <app-boolean-button class="d-inline-block"
          name="technologyType5"
          required
          [(ngModel)]="_form().technologyType5"
          [trueLabel]="'да'"
          [falseLabel]="'нет'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      </div>
      <div>
        <span>VI технологический уклад: </span>
        <app-boolean-button class="d-inline-block"
          name="technologyType6"
          required
          [(ngModel)]="_form().technologyType6"
          [trueLabel]="'да'"
          [falseLabel]="'нет'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      </div>
      <div>
        <span>проект другого технологического уклада: </span>
        <app-boolean-button class="d-inline-block"
          name="technologyOtherType"
          required
          [(ngModel)]="_form().technologyOtherType"
          [trueLabel]="'да'"
          [falseLabel]="'нет'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      </div>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().technologyTypeText"
          [attr.name]="'technologyTypeText_' + num().split('.').join('_')"
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
export class TechnologyTypeBlockComponent {

  readonly num = input<string>("1.3");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    technologyType5: boolean;
    technologyType6: boolean;
    technologyOtherType: boolean;
    technologyTypeText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
