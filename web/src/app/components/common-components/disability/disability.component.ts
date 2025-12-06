import {Component, forwardRef} from '@angular/core';
import {ControlComponent} from "app/components/common-components/control-component";
import {DisabilityDto} from "app/dto/DisabilityDto";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

export const DISABILITY_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DisabilityComponent),
  multi: true
};

@Component({
  selector: 'app-disability',
  template: `
    <ng-container *ngIf="_value != null">
      <div class="btn-group" style="margin-top: 0.5rem">
        <label class="btn btn-sm btn-primary mr-2" [class.active]="_value.isPensioner"
               (click)="_value.isPensioner = !_value.isPensioner">
          <fa-icon *ngIf="_value.isPensioner" icon="check"></fa-icon>
          Пенсионер
        </label>
        <label class="btn btn-sm btn-primary" [class.active]="_value.isDisabled"
               (click)="_value.isDisabled = !_value.isDisabled">
          <fa-icon *ngIf="_value.isDisabled" icon="check"></fa-icon>
          Инвалидность
        </label>
      </div>
      
      <div *ngIf="_value.isPensioner" class="form-sub-group">
        <label>Постановка на учёт пенсионера в управлении по труду и соцзащите</label>
        <div class="input-group separated">
          <app-date-input class="width-auto" [(ngModel)]="_value.pensionerStartDate" [title]="'Дата постановки на учёт'">
          </app-date-input>
          <input class="form-control width-auto" type="text" title="Управление по труду и соцзащите"
                 [(ngModel)]="_value.administration" placeholder="Управление по труду и соцзащите"/>
        </div>
      </div>
      <div *ngIf="_value.isDisabled" class="form-sub-group">
        <label>Группа инвалидности</label>
        <div class="input-group">
          <input class="form-control" type="text" title="Группа инвалидности"
                 placeholder="Группа инвалидности"
                 [(ngModel)]="_value.disabledGroup"/>
        </div>
      </div>
      <div *ngIf="!_value.isDisabled && !_value.isPensioner" class="italic">Данные отсутствуют</div>
    </ng-container>
  `,
  providers: [DISABILITY_CONTROL_VALUE_ACCESSOR]
})
export class DisabilityComponent extends ControlComponent<DisabilityDto> {
}
