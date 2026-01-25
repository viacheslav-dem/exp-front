import {Component, OnInit, input, output} from "@angular/core";

@Component({
    selector: 'app-availability-of-documents-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Для объектов государственной экспертизы, указанных в подпункте 8.4 пункта 8 Положения,
        устанавливается наличие документов, являющихся обязательными при проведении государственной экспертизы:
      </label>
      <ul>
        <li>
          подготовленный в установленном порядке бизнес-план (по проектам, направленным на создание и/или освоение новых технологий
          и/или видов продукции (работ, услуг);
        </li>
        <li>
          письменные обязательства государственного заказчика и/или других заинтересованных по практическому использованию результатов
          исследований и разработок, полученных при реализации проекта (для проектов прикладного характера);
        </li>
        <li>
          письменные обязательства государственного заказчика и/или других заинтересованных по долевому участию в финансировании
          затрат по проекту в размере не менее 50 процентов общего объема планируемых на эти цели средств
          (по проектам, в рамках которых планируется выполнение опытно-конструкторских и опытно-технологических работ);
        </li>
        <li>
          копия договора о сотрудничестве с зарубежной организацией-партнером;
        </li>
        <li>
          акт ведомственной экспертизы.
        </li>
      </ul>
      <input type="hidden" [ngModel]="_form().availabilityDoc" name="availabilityDoc" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().availabilityDoc === true}" (click)="stateButton(true)">
          Имеются
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().availabilityDoc === false}" (click)="stateButton(false)">
          Не имеются
        </button>
      </div>
      @if (full()) {
        <textarea
          [ngModel]="_form().availabilityDocText"
          (ngModelChange)="emitPatch({ availabilityDocText: $event })"
          name="availabilityDocText"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)"
        ></textarea>
      }
      @if (full()) {
        <div class="hint">
          <div>
            <b>Подсказка.</b>
            Если в материалах по объекту государственной экспертизы отсутствует соответствующая информация,
            эксперт должен указать в данном пункте заключения фразу: «Не представлено в материалах по объекту государственной экспертизы».
          </div>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class AvailabilityOfDocumentsBlock2025Component implements OnInit{

    readonly num = input<string>("10.1");

    readonly full = input<boolean>(true);

    readonly _form = input<AvailabilityOfDocumentsBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<AvailabilityOfDocumentsBlock2025Form>>();

    emitPatch(patch: Partial<AvailabilityOfDocumentsBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    stateButton(flag: boolean) {
        this.emitPatch({ availabilityDoc: flag });
    }

    ngOnInit(): void {
        // Инициализация через emitPatch вместо прямой мутации
        this.emitPatch({ availabilityDoc: false });
    }
}

type AvailabilityOfDocumentsBlock2025Form = {
    availabilityDoc: boolean;
    availabilityDocSuggestion: string;
    availabilityDocText: string;
};
