import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProjectDto} from "@app/dto/ProjectDto";
import {IdNameDto} from "@app/dto/IdNameDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";

@Component({
    selector: 'app-select-directions-and-goals-block-2025',
    template: `
    <ng-container *ngIf="_project">
      <div *ngIf="_allDirections.length > 0" class="form-group">
        <label>
          <span *ngIf="num">{{ num }}.</span>
          Выберите приоритетные направления научной,
          научно-технической и инновационной деятельности в Республике Беларусь,
          которым объект экспертизы <b>соответствует</b>:
        </label>
        <div *ngFor="let direction of _allDirections">
          <app-checkbox [(ngModel)]="direction.isChecked"
                        (ngModelChange)="onDirectionChanged()">{{ direction.name }}
          </app-checkbox>
        </div>
      </div>

      <div *ngIf="canHasSocialEconomicGoals() && _allGoals.length > 0" class="form-group">
        <label>
          Выберите цели (приоритеты) социально-экономического развития,
          которым объект экспертизы <b>соответствует</b>:
        </label>
        <div *ngFor="let item of _allGoals">
          <app-checkbox [(ngModel)]="item.isChecked" (ngModelChange)="onGoalChanged()">{{ item.name }}
          </app-checkbox>
        </div>
        <textarea [(ngModel)]="_form.directionsAndGoalsText" rows="3" class="form-control mt-05"
                  placeholder="Пояснительный текст (при необходимости)."></textarea>
      </div>
      <textarea *ngIf="showTarget8_4()" [(ngModel)]="_form.multilateralDirectionsText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="showTarget8_4()" class="hint">
        <p>
          <b>Подсказка.</b>
          Для объектов государственной экспертизы, указанных в подпункте 8.4 пункта 8 Положения, дополнительно
          указывается соответствие приоритетным направлениям двустороннего (многостороннего) научно-технического
          сотрудничества с государством-партнером (государствами-партнерами):
          соответствует (перечисляются соответствующие приоритетные направления, заявленные в рамках проводимого
          конкурса совместных проектов, к которым относится объект государственной экспертизы) / не соответствует.
        </p>
      </div>
    </ng-container>
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
