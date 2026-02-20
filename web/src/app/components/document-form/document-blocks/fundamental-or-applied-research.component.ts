import {Component, OnInit, input, output} from "@angular/core";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-fundamental-or-applied-research-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие научного исследования по объекту государственной экспертизы:
      </label>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form()?.fundamentalOrAppliedResearch === true}" (click)="stateButton(true)">
          Соответствует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form()?.fundamentalOrAppliedResearch === false}" (click)="stateButton(false)">
          Не соответствует
        </button>
      </div>
      @if (full()) {
        <div class="hint">
          <b>Подсказка.</b>
          Перечисляются соответствующие приоритетные направления, в том числе сквозные, к которым относится объект государственной экспертизы:
        </div>
      }
      @if (full()) {
        <textarea [ngModel]="_form()?.fundamentalOrAppliedResearchText" (ngModelChange)="emitPatch({ fundamentalOrAppliedResearchText: $event })" rows="3" class="form-control mt-05"
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
export class FundamentalOrAppliedResearchComponent implements OnInit{

    readonly num = input<string>("10.1");

    readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

    readonly full = input<boolean>(true);

    readonly _form = input<FundamentalOrAppliedResearchForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<FundamentalOrAppliedResearchForm>>();

    emitPatch(patch: Partial<FundamentalOrAppliedResearchForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }

    stateButton(flag: boolean) {
        this.emitPatch({ fundamentalOrAppliedResearch: flag });
    }

    ngOnInit(): void {
        this.stateButton(false);
    }
}

type FundamentalOrAppliedResearchForm = {
  fundamentalOrAppliedResearch: boolean;
  fundamentalOrAppliedResearchText: string;
};
