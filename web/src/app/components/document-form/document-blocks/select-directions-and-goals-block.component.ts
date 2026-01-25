import {Component, effect, input, output} from '@angular/core';
import {ProjectDto} from "@app/dto/ProjectDto";
import {IdNameDto} from "@app/dto/IdNameDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";

@Component({
    selector: 'app-select-directions-and-goals-block',
    template: `
    @if (_project) {
      @if (_allDirections.length > 0) {
        <div class="form-group">
          <label>
            @if (num()) {
              <span>{{num()}}.</span>
            }
            Выберите приоритетные направления научной,
            научно-технической и инновационной деятельности в Республике Беларусь,
            которым объект экспертизы <b>соответствует</b>:
          </label>
          @for (direction of _allDirections; track direction.id) {
            <div>
              <app-checkbox [ngModel]="direction.isChecked"
              (ngModelChange)="onDirectionChanged($event, direction)">{{direction.name}}</app-checkbox>
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
              <app-checkbox [ngModel]="item.isChecked" (ngModelChange)="onGoalChanged($event, item)">{{item.name}}</app-checkbox>
            </div>
          }
          <textarea [ngModel]="_form()?.directionsAndGoalsText" (ngModelChange)="emitPatch({ directionsAndGoalsText: $event })" name="directionsAndGoalsText" rows="3" class="form-control mt-05"
          placeholder="Пояснительный текст (при необходимости)."></textarea>
        </div>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Оценивается соответствие / несоответствие объекта государственной экспертизы приоритету(-ам) и цели(-ям) государственной политики в сфере социально-экономического развития (для проектов государственных программ (за исключением государственной программы в сфере цифрового развития), в рамках которых предусматривается реализация мероприятий в сферах научной, научно-технической и инновационной деятельности) / приоритетному(-ым) направлению(-ям) научной, научно-технической и инновационной деятельности в Республике Беларусь, в том числе сквозному(-ым) приоритетному(-ым) направлению(-ям)* (для проектов государственных научно-технических программ), указанному(-ым) в материалах объекта государственной экспертизы и в пункте 5, а также их соответствие / несоответствие действующим нормативным правовым актам.
          </p>
        </div>
      }
    }
    `,
    standalone: false
})
export class SelectDirectionsAndGoalsBlockComponent {
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
  readonly formPatch = output<Partial<SelectDirectionsAndGoalsBlockForm>>();

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
    if (!project || !form) {
      return;
    }
    this.update(form);
  });

  canHasSocialEconomicGoals() {
    // Проект может приходить частично (например, без code) — не падаем в рантайме.
    return this._project?.code?.code === '8.13';
  }

  private update(form: SelectDirectionsAndGoalsBlockForm) {
    if (this._project && form) {
      const directions = this._project.directions ?? [];
      const goals = this._project.socialEconomicGoals ?? [];

      this._allDirections = directions.map(item => new IdNameDto(item.id, item.name));
      const selectedDirections = (form.selectedDirections || []).filter(selectedItem =>
        this._allDirections.some(item => item.id == selectedItem.id));
      this._allDirections.forEach(item => item.isChecked =
        selectedDirections.some(selectedItem => selectedItem.id == item.id));

      this._allGoals = goals.map(item => new IdNameDto(item.id, item.name));
      const selectedSocialEconomicGoals = (form.selectedSocialEconomicGoals || []).filter(selectedItem =>
        this._allGoals.some(item => item.id == selectedItem.id));
      this._allGoals.forEach(item => item.isChecked =
        selectedSocialEconomicGoals.some(selectedItem => selectedItem.id == item.id));
    }
  }

  emitPatch(patch: Partial<SelectDirectionsAndGoalsBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }

  onDirectionChanged(isChecked: boolean, direction: IdNameDto) {
    direction.isChecked = isChecked;
    const selectedDirections = this._allDirections.filter(d => d.isChecked).map(d => new IdNameDto(d.id, d.name));
    this.emitPatch({ selectedDirections });
  }

  onGoalChanged(isChecked: boolean, goal: IdNameDto) {
    goal.isChecked = isChecked;
    const selectedSocialEconomicGoals = this._allGoals.filter(d => d.isChecked).map(d => new IdNameDto(d.id, d.name));
    this.emitPatch({ selectedSocialEconomicGoals });
  }
}

type SelectDirectionsAndGoalsBlockForm = {
  selectedDirections: IdNameDto[];
  selectedSocialEconomicGoals: IdNameDto[];
  directionsAndGoalsText: string;
};
