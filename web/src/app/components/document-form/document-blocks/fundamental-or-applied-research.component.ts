import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-fundamental-or-applied-research-2025',
    template: `
    <div class="form-sub-group">
        <label>
            {{num}}. Соответствие научного исследования по объекту государственной экспертизы:
        </label>
        <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form.fundamentalOrAppliedResearch === true}" (click)="stateButton(true)">
                Соответсвует
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form.fundamentalOrAppliedResearch === false}" (click)="stateButton(false)">
                Не соотвествует
            </button>
        </div>
        <div *ngIf="full" class="hint">
            <b>Подсказка.</b>
            Перечисляются соответствующие приоритетные направления, в том числе сквозные, к которым относится объект государственной экспертизы:
        </div>
      <textarea *ngIf="full" [(ngModel)]="_form.fundamentalOrAppliedResearchText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
        <div *ngIf="full" class="hint">
            <div>
                <b>Подсказка.</b>
                Для объектов государственной экспертизы, указанных в подпункте 8.4 пункта 8 Положения, дополнительно указывается
                соответствие приоритетным направлениям двустороннего (многостороннего) научно-технического сотрудничества
                с государством-партнером (государствами-партнерами):
            </div>
        </div>
    </div>
  `,
    standalone: false
})
export class FundamentalOrAppliedResearchComponent implements OnInit{

    @Input()
    num: string = "10.1";

    @Input()
    project: ProjectPlainDto | ProjectDto;

    @Input()
    full: boolean = true;

    @Input()
    _form: { fundamentalOrAppliedResearch: boolean, fundamentalOrAppliedResearchText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();


    stateButton(flag: boolean) {
        if(flag){
            this._form.fundamentalOrAppliedResearch = true;
        } else{
            this._form.fundamentalOrAppliedResearch = false;
        }
    }

    ngOnInit(): void {
        this.stateButton(false);
    }

}
