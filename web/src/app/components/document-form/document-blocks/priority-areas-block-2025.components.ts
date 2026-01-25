import {Component, OnInit, input, output} from "@angular/core";

@Component({
    selector: 'app-priority_areas-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие приоритетным направлениям научной, научно-технической и инновационной деятельности в Республике Беларусь
      </label>
      <input type="hidden" [ngModel]="_form()?.priorityAreas" name="priorityAreas" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form()?.priorityAreas === true}" (click)="stateButton(true)">
          Соответствует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form()?.priorityAreas === false}" (click)="stateButton(false)">
          Не соответствует
        </button>
      </div>
      <!--      <ng-container *ngIf="_form.priorityAreas" >-->
      <!--      -->
      <!--        <textarea [(ngModel)]="_form.priorityAreasSuggestion" rows="2" class="form-control mt-2"-->
      <!--                  title="Рекомендуемое наименование"-->
    <!--                  placeholder="Приоритетные направления, в том числе сквозные."></textarea>-->
    <!--      </ng-container>-->
    @if (full()) {
      <div class="hint">
        <b>Подсказка.</b>
        Перечисляются соответствующие приоритетные направления, в том числе сквозные, к которым относится объект государственной экспертизы:
      </div>
    }
    @if (full()) {
      <textarea
        [ngModel]="_form()?.priorityAreasText"
        (ngModelChange)="emitPatch({ priorityAreasText: $event })"
        [name]="'priorityAreasText_' + num().split('.').join('_')"
        required
        minlength="30"
        maxlength="5000"
        rows="3"
        class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
    }
    @if (full()) {
      <div class="hint">
        <div>
          <b>Подсказка.</b>
          Для объектов государственной экспертизы, указанных в подпункте 8.4 пункта 8 Положения, дополнительно указывается
          соответствие приоритетным направлениям двустороннего (многостороннего) научно-технического сотрудничества
          с государством-партнером (государствами-партнерами):
        </div>
      </div>
    }
    </div>
    `,
    standalone: false
})
export class PriorityAreasBlock2025Components implements OnInit{

    readonly num = input<string>("10.1");

    readonly full = input<boolean>(true);

    readonly _form = input<PriorityAreasBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<PriorityAreasBlock2025Form>>();

    emitPatch(patch: Partial<PriorityAreasBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    stateButton(flag: boolean) {
        this.emitPatch({ priorityAreas: flag });
    }

    ngOnInit(): void {
        // Инициализация через emitPatch вместо прямой мутации
        this.emitPatch({ priorityAreas: false });
    }
}

type PriorityAreasBlock2025Form = {
    priorityAreas: boolean;
    priorityAreasText: string;
};
