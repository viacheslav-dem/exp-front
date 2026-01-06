import {Component, EventEmitter, OnInit, Output, input} from "@angular/core";

@Component({
    selector: 'app-priority_areas-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие приоритетным направлениям научной, научно-технической и инновационной деятельности в Республике Беларусь
      </label>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().priorityAreas === true}" (click)="stateButton(true)">
          Соответствует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().priorityAreas === false}" (click)="stateButton(false)">
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
      <textarea [(ngModel)]="_form().priorityAreasText"
        [attr.name]="'priorityAreasText_' + num().split('.').join('_')"
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

    readonly _form = input<{
    priorityAreas: boolean;
    priorityAreasText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();


    stateButton(flag: boolean) {
        if(flag){
            this._form().priorityAreas = true;
        } else{
            this._form().priorityAreas = false;
        }
    }

    ngOnInit(): void {
        this.stateButton(false);
    }
}
