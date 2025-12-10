import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Text} from "@app/components/document-form/form-model/Text";

@Component({
    selector: 'app-scientific-level-items-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Выберите пункты, наличие которых подтверждает научно-технический уровень внедряемых технологий:
      </label>
      <div *ngFor="let opt of scientificLevelItems">
        <app-checkbox [(ngModel)]="opt.isChecked" (onChecked)="onChecked()"> {{opt.text}}</app-checkbox>
      </div>
      <textarea *ngIf="full" [(ngModel)]="_form.scientificLevelItemsText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
    </div>
  `,
    standalone: false
})
export class ScientificLevelItemsBlockComponent {

  scientificLevelItems: Text[] = [
    new Text('патенты на объекты права промышленной собственности, полученные в Республике Беларусь и за рубежом ' +
      '(решения патентных органов о выдаче патентов)'),
    new Text('имущественные права на секреты производства (ноу-хау)'),
    new Text('исключительные права на программное обеспечение'),
    new Text('лицензионные договоры на предоставление права использования результатов интеллектуальной деятельности'),
    new Text('договоры на передачу секретов производства (ноу-хау)'),
  ];
  _form: { scientificLevelItems: Text[], scientificLevelItemsText: string };

  @Input()
  num: string = "5.2";

  @Input()
  full: boolean = true;

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  set form(_form: { scientificLevelItems: Text[], scientificLevelItemsText: string }) {
    this._form = _form;
    this.scientificLevelItems.forEach(item => item.isChecked = _form.scientificLevelItems.some(checked => checked.text == item.text));
  }

  onChecked() {
    this._form.scientificLevelItems = this.scientificLevelItems
      .filter(item => item.isChecked)
      .map(item => new Text(item.text));
    this.onConditionsChanged.emit(true);
  }
}
