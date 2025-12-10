import {Component, EventEmitter, Input, Output} from '@angular/core';
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
            @if (num) {
              <span>{{num}}.</span>
            }
            Выберите приоритетные направления научной,
            научно-технической и инновационной деятельности в Республике Беларусь,
            которым объект экспертизы <b>соответствует</b>:
          </label>
          @for (direction of _allDirections; track direction) {
            <div>
              <app-checkbox [(ngModel)]="direction.isChecked"
              (ngModelChange)="onDirectionChanged()">{{direction.name}}</app-checkbox>
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
          @for (item of _allGoals; track item) {
            <div>
              <app-checkbox [(ngModel)]="item.isChecked" (ngModelChange)="onGoalChanged()">{{item.name}}</app-checkbox>
            </div>
          }
          <textarea [(ngModel)]="_form.directionsAndGoalsText" rows="3" class="form-control mt-05"
          placeholder="Пояснительный текст (при необходимости)."></textarea>
        </div>
      }
      @if (full) {
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

  @Input()
  num: string;

  @Input()
  full: boolean = true;

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  set project(project: ProjectPlainDto | ProjectDto) {
    this._project = project;
    this.update();
  }

  @Input()
  set form(form: {
    selectedDirections: IdNameDto[],
    selectedSocialEconomicGoals: IdNameDto[],
    directionsAndGoalsText: string
  }) {
    this._form = form;
    this.update();
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
