import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-requirements-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Достаточность требований, предъявляемых к квалификации и опыту (компетенции) лиц, 
        привлекаемых для выполнения работ (оказания услуг), а также к уровню производственной, научной, 
        конструкторско-технологической базы, необходимой для реализации мероприятия:
      </label>
      <app-boolean-button [(ngModel)]="_form.requirements" [trueLabel]="'достаточны'"
                          [falseLabel]="'недостаточны'" 
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.requirementsText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
    </div>
  `,
    standalone: false
})
export class RequirementsBlockComponent {

  @Input()
  num: string = "8";

  @Input()
  full: boolean = true;

  @Input()
  _form: {
    requirements: boolean;
    requirementsText: string;
  };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
