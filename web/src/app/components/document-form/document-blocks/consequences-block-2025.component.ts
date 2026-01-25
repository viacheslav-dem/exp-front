import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-consequences-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка возможных социальных, экономических и экологических последствий внедрения выбранных технологий
        и необходимости модернизации (реконструкции) взаимосвязанных действующих производственных объектов.
      </label>
      <textarea
        [ngModel]="_form()?.consequences"
        (ngModelChange)="emitPatch({ consequences: $event })"
        [name]="'consequences_' + num().split('.').join('_')"
        required
        minlength="30"
        maxlength="5000"
        rows="3"
        class="form-control"
        placeholder="Обязательный текст."
      ></textarea>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Эксперт должен привести оценку возможных социальных, экономических и экологических последствий внедрения выбранных технологий
            и необходимости модернизации (реконструкции) взаимосвязанных действующих производственных объектов для объекта государственной
            экспертизы с обязательным указанием ссылок на наименования документов и номера страниц, в которых приводится соответствующая
            информация по представленным материалам объекта государственной экспертизы; если в материалах по объекту государственной
            экспертизы отсутствует соответствующая информация, эксперт должен указать в данном пункте заключения фразу: «не представлено
            в материалах по объекту государственной экспертизы» и дать свою экспертную оценку по данному вопросу.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ConsequencesBlock2025Component {

    readonly num = input<string>("2.6");

    readonly full = input<boolean>(true);

    readonly _form = input<ConsequencesBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<ConsequencesBlock2025Form>>();

    emitPatch(patch: Partial<ConsequencesBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }
}

type ConsequencesBlock2025Form = {
    consequences: string;
};