import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-requirements-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Достаточность требований, предъявляемых к квалификации и опыту (компетенции) лиц,
        привлекаемых для выполнения работ (оказания услуг), а также к уровню производственной, научной,
        конструкторско-технологической базы, необходимой для реализации мероприятия:
      </label>
      <app-boolean-button name="requirements" required [(ngModel)]="_form().requirements" [trueLabel]="'достаточны'"
        [falseLabel]="'недостаточны'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().requirementsText"
          [attr.name]="'requirementsText_' + num().split('.').join('_')"
          required
          minlength="30"
          rows="3"
          class="form-control mt-05"
        placeholder="Обязательный текст."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class RequirementsBlockComponent {

  readonly num = input<string>("8");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    requirements: boolean;
    requirementsText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
