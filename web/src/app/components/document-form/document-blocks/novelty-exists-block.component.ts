import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-novelty-exists-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Создание и внедрение новых технологий и (или) производство новой для Республики Беларусь
        и (или) мировой экономики продукции:
      </label>
      <app-boolean-button [(ngModel)]="_form.noveltyExists" [trueLabel]="'соответствует'"
                          [falseLabel]="'не соответствует'"
                          (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.noveltyExistsText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `
})
export class NoveltyExistsBlockComponent {

  @Input()
  num: string = "1.2";

  @Input()
  full: boolean = true;

  @Input()
  _form: { noveltyExists: boolean, noveltyExistsText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
