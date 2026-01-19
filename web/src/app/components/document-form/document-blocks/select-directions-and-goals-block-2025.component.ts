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
              <app-checkbox [(ngModel)]="direction.isChecked"
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
              <app-checkbox [(ngModel)]="item.isChecked" (ngModelChange)="onGoalChanged()">{{ item.name }}
              </app-checkbox>
            </div>
          }
          <textarea [(ngModel)]="_form.directionsAndGoalsText" name="directionsAndGoalsText" rows="3" class="form-control mt-05"
          placeholder="Пояснительный текст (при необходимости)."></textarea>
        </div>
      }
      @if (showTarget8_4()) {
        <textarea [(ngModel)]="_form.multilateralDirectionsText" name="multilateralDirectionsText" required minlength="30" maxlength="5000" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)."></textarea>
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
  _form: {
    selectedDirections: IdNameDto[],
    selectedSocialEconomicGoals: IdNameDto[],
    directionsAndGoalsText: string
  };

  readonly num = input<string>(undefined);

  readonly full = input<boolean>(true);

  readonly onConditionsChanged = output<boolean>();

  readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

  readonly form = input<{
    selectedDirections: IdNameDto[],
    selectedSocialEconomicGoals: IdNameDto[],
    directionsAndGoalsText: string
  }>(undefined);

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
    return this._project.code.code.startsWith('8.4');
  }

  canHasSocialEconomicGoals() {
    return this._project.code.code == '8.13';
  }

  private update() {
    if (this._form) {
      this._form.selectedDirections = this._form.selectedDirections || [];
      this._form.selectedSocialEconomicGoals = this._form.selectedSocialEconomicGoals || [];
    }
    if (this._project && this._form) {
      this._allDirections = this._project.directions.map(item => new IdNameDto(item.id, item.name));
      this._form.selectedDirections = this._form.selectedDirections.filter(selectedItem =>
        this._allDirections.some(item => item.id == selectedItem.id))
      this._allDirections.forEach(item => item.isChecked =
        this._form.selectedDirections.some(selectedItem => selectedItem.id == item.id));

      this._allGoals = this._project.socialEconomicGoals.map(item => new IdNameDto(item.id, item.name));
      this._form.selectedSocialEconomicGoals = this._form.selectedSocialEconomicGoals.filter(selectedItem =>
        this._allGoals.some(item => item.id == selectedItem.id))
      this._allGoals.forEach(item => item.isChecked =
        this._form.selectedSocialEconomicGoals.some(selectedItem => selectedItem.id == item.id));
    }
  }

  onDirectionChanged() {
    this._form.selectedDirections = this._allDirections.filter(d => d.isChecked).map(d => new IdNameDto(d.id, d.name));
    this.onConditionsChanged.emit(true);
  }

  onGoalChanged() {
    this._form.selectedSocialEconomicGoals = this._allGoals.filter(d => d.isChecked).map(d => new IdNameDto(d.id, d.name));
    this.onConditionsChanged.emit(true);
  }

}
