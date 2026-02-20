import {Component, effect, input, output} from '@angular/core';
import {ProjectDto} from "@app/dto/ProjectDto";
import {IdNameDto} from "@app/dto/IdNameDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";

@Component({
    selector: 'app-select-directions-and-goals-block-2025',
    template: `
    @if (_project) {
      @if (_allDirections.length > 0) {
        <div class="form-group">
          <label>
            @if (num()) {
              <span>{{ num() }}.</span>
            }
            Выберите приоритетные направления научной,
            научно-технической и инновационной деятельности в Республике Беларусь,
            которым объект экспертизы <b>соответствует</b>:
          </label>
          @for (direction of _allDirections; track direction.id) {
            <div>
              <app-checkbox [ngModel]="direction.isChecked"
                (ngModelChange)="onDirectionChanged()">{{ direction.name }}
              </app-checkbox>
            </div>
          }
        </div>
      }
      @if (canHasSocialEconomicGoals() && _allGoals.length > 0) {
        <div class="form-group">
          <label>
            Выберите цели (приоритеты) социально-экономического развития,
            которым объект экспертизы <b>соответствует</b>:
          </label>
          @for (item of _allGoals; track item.id) {
            <div>
              <app-checkbox [ngModel]="item.isChecked" (ngModelChange)="onGoalChanged()">{{ item.name }}
              </app-checkbox>
            </div>
          }
          <textarea [ngModel]="_form?.directionsAndGoalsText" (ngModelChange)="emitPatch({ directionsAndGoalsText: $event })" name="directionsAndGoalsText" rows="3" class="form-control mt-05"
          placeholder="Пояснительный текст (при необходимости)."></textarea>
        </div>
      }
      @if (showTarget8_4()) {
        <div class="form-sub-group">
          <label>
            @if (num()) {
              <span>{{ num() }}.</span>
            }
            Соответствие приоритетным направлениям двустороннего (многостороннего) научно-технического сотрудничества:
          </label>
          <textarea [ngModel]="_form?.multilateralDirectionsText" (ngModelChange)="emitPatch({ multilateralDirectionsText: $event })" name="multilateralDirectionsText" required minlength="30" maxlength="5000" rows="3" class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."></textarea>
        </div>
      }
      @if (showTarget8_4()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Для объектов государственной экспертизы, указанных в подпункте 8.4 пункта 8 Положения, дополнительно
            указывается соответствие приоритетным направлениям двустороннего (многостороннего) научно-технического
            сотрудничества с государством-партнером (государствами-партнерами):
            соответствует (перечисляются соответствующие приоритетные направления, заявленные в рамках проводимого
            конкурса совместных проектов, к которым относится объект государственной экспертизы) / не соответствует.
          </p>
        </div>
      }
    }
    `,
    standalone: false
})
export class SelectDirectionsAndGoalsBlock2025Component {
  _project: ProjectPlainDto | ProjectDto;
  _allDirections: IdNameDto[] = [];
  _allGoals: IdNameDto[] = [];
  _form: SelectDirectionsAndGoalsBlock2025Form | undefined;

  readonly num = input<string>(undefined);

  readonly full = input<boolean>(true);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<SelectDirectionsAndGoalsBlock2025Form>>();

  readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

  readonly form = input<SelectDirectionsAndGoalsBlock2025Form>(undefined);

  emitPatch(patch: Partial<SelectDirectionsAndGoalsBlock2025Form>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }

  private readonly inputsEffect = effect(() => {
    const project = this.project();
    const form = this.form();
    this._project = project;
    this._form = form;
    if (!project || !form) {
      return;
    }
    this.update();
  });

  showTarget8_4() {
    // Проект может приходить частично (например, без code) — не падаем в рантайме.
    return this._project?.code?.code?.startsWith('8.4') ?? false;
  }

  canHasSocialEconomicGoals() {
    return this._project?.code?.code === '8.13';
  }

  private update() {
    if (!this._project || !this._form) {
      return;
    }
    const directions = this._project.directions ?? [];
    const goals = this._project.socialEconomicGoals ?? [];
    const selectedDirections = this._form.selectedDirections ?? [];
    const selectedGoals = this._form.selectedSocialEconomicGoals ?? [];

    this._allDirections = directions.map(item => new IdNameDto(item.id, item.name));
    this._allDirections.forEach(item => item.isChecked =
      selectedDirections.some(selectedItem => selectedItem.id == item.id));

    this._allGoals = goals.map(item => new IdNameDto(item.id, item.name));
    this._allGoals.forEach(item => item.isChecked =
      selectedGoals.some(selectedItem => selectedItem.id == item.id));
  }

  onDirectionChanged() {
    const selected = this._allDirections.filter(d => d.isChecked).map(d => new IdNameDto(d.id, d.name));
    this.emitPatch({ selectedDirections: selected });
  }

  onGoalChanged() {
    const selected = this._allGoals.filter(d => d.isChecked).map(d => new IdNameDto(d.id, d.name));
    this.emitPatch({ selectedSocialEconomicGoals: selected });
  }
}

type SelectDirectionsAndGoalsBlock2025Form = {
  selectedDirections: IdNameDto[];
  selectedSocialEconomicGoals: IdNameDto[];
  directionsAndGoalsText: string;
  multilateralDirectionsText?: string;
};
