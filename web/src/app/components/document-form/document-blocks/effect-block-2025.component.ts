import {Component, Input} from "@angular/core";

@Component({
    selector: 'app-effect-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Возможный экономический и (или) социальный и (или) экологический эффект от реализации мероприятия.
      </label>
      <textarea [(ngModel)]="_form.effect" rows="3" class="form-control"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
            Эксперт должен конкретно обозначить возможный эффект по объекту экспертизы по представленным материалам объекта государственной экспертизы.
        </p>
      </div>
    </div>
  `
})
export class EffectBlock2025Component {

    @Input()
    num: string = "3";

    @Input()
    full: boolean = true;

    @Input()
    _form: { effect: string };
}