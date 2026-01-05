import {Component, input} from "@angular/core";

@Component({
    selector: 'app-effect-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Возможный экономический и (или) социальный и (или) экологический эффект от реализации мероприятия.
      </label>
      <textarea [(ngModel)]="_form().effect" name="effect" required minlength="30" maxlength="5000" rows="3" class="form-control"
      placeholder="Обязательный текст (не менее 30 символов)."></textarea>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Эксперт должен конкретно обозначить возможный эффект по объекту экспертизы по представленным материалам объекта государственной экспертизы.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class EffectBlock2025Component {

    readonly num = input<string>("3");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    effect: string;
}>(undefined);
}