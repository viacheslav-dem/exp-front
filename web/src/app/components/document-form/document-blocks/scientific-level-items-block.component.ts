import {Component, EventEmitter, Output, effect, input} from '@angular/core';
import {Text} from "@app/components/document-form/form-model/Text";

@Component({
    selector: 'app-scientific-level-items-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Выберите пункты, наличие которых подтверждает научно-технический уровень внедряемых технологий:
      </label>
      @for (opt of scientificLevelItems; track opt) {
        <div>
          <app-checkbox [(ngModel)]="opt.isChecked" (onChecked)="onChecked()"> {{opt.text}}</app-checkbox>
        </div>
      }
      @if (full()) {
        <textarea [(ngModel)]="_form.scientificLevelItemsText" name="scientificLevelItemsText" required minlength="30" maxlength="5000" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)."></textarea>
      }
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

  readonly num = input<string>("5.2");

  readonly full = input<boolean>(true);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  readonly form = input<{ scientificLevelItems: Text[], scientificLevelItemsText: string }>(undefined);

  private readonly formEffect = effect(() => {
    const _form = this.form();
    if (!_form) {
      return;
    }
    this._form = _form;
    this.scientificLevelItems.forEach(item => item.isChecked = _form.scientificLevelItems.some(checked => checked.text == item.text));
  });

  onChecked() {
    this._form.scientificLevelItems = this.scientificLevelItems
      .filter(item => item.isChecked)
      .map(item => new Text(item.text));
    this.onConditionsChanged.emit(true);
  }
}
