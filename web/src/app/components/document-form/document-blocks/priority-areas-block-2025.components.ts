import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

@Component({
    selector: 'app-priority_areas-block-2025',
    template: `
    <div class="form-sub-group">
        <label>
            {{num}}. Соответствие приоритетным направлениям научной, научно-технической и инновационной деятельности в Республике Беларусь
        </label>
        <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form.priorityAreas === true}" (click)="stateButton(true)">
                Соответсвует
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form.priorityAreas === false}" (click)="stateButton(false)">
                Не соотвествует
            </button>
        </div>
<!--      <ng-container *ngIf="_form.priorityAreas" >-->
<!--      -->
<!--        <textarea [(ngModel)]="_form.priorityAreasSuggestion" rows="2" class="form-control mt-2"-->
<!--                  title="Рекомендуемое наименование"-->
<!--                  placeholder="Приоритетные направления, в том числе сквозные."></textarea>-->
<!--      </ng-container>-->
        <div *ngIf="full" class="hint">
            <b>Подсказка.</b>
            Перечисляются соответствующие приоритетные направления, в том числе сквозные, к которым относится объект государственной экспертизы:
        </div>
      <textarea *ngIf="full" [(ngModel)]="_form.priorityAreasText" rows="3" class="form-control mt-05"
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
export class PriorityAreasBlock2025Components implements OnInit{

    @Input()
    num: string = "10.1";

    @Input()
    full: boolean = true;

    @Input()
    _form: { priorityAreas: boolean, priorityAreasText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();


    stateButton(flag: boolean) {
        if(flag){
            this._form.priorityAreas = true;
        } else{
            this._form.priorityAreas = false;
        }
    }

    ngOnInit(): void {
        this.stateButton(false);
    }
}
