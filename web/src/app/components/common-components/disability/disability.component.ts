import {ChangeDetectionStrategy, Component, forwardRef} from '@angular/core';
import {ControlComponent} from "app/components/common-components/control-component";
import {DisabilityDto} from "app/dto/DisabilityDto";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {environment} from "../../../../environments/environment";

export const DISABILITY_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DisabilityComponent),
  multi: true
};

@Component({
    selector: 'app-disability',
    template: `
    @if (_value != null) {
      <div class="btn-group" style="margin-top: 0.5rem">
        <label class="btn btn-sm btn-primary me-2" [class.active]="_value.isPensioner"
          (click)="_value.isPensioner = !_value.isPensioner">
          @if (_value.isPensioner) {
            <fa-icon icon="check"></fa-icon>
          }
          Пенсионер
        </label>
        <label class="btn btn-sm btn-primary" [class.active]="_value.isDisabled"
          (click)="_value.isDisabled = !_value.isDisabled">
          @if (_value.isDisabled) {
            <fa-icon icon="check"></fa-icon>
          }
          Инвалидность
        </label>
      </div>
      @if (_value.isPensioner) {
        <div class="form-sub-group">
          <label>Постановка на учёт пенсионера в управлении по труду и соцзащите</label>
          <div class="input-group separated">
            <app-date-input class="width-auto" [(ngModel)]="_value.pensionerStartDate" [title]="'Дата постановки на учёт'">
            </app-date-input>
            <input class="form-control width-auto" type="text" title="Управление по труду и соцзащите"
              [(ngModel)]="_value.administration" placeholder="Управление по труду и соцзащите"/>
            </div>
          </div>
        }
        @if (_value.isDisabled) {
          <div class="form-sub-group">
            <label>Группа инвалидности</label>
            <div class="input-group">
              <input class="form-control" type="text" title="Группа инвалидности"
                placeholder="Группа инвалидности"
                [(ngModel)]="_value.disabledGroup"/>
              </div>
            </div>
          }
          @if (!_value.isDisabled && !_value.isPensioner) {
            <div class="italic">Данные отсутствуют</div>
          }
        }
    `,
    providers: [DISABILITY_CONTROL_VALUE_ACCESSOR],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.commonControls)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class DisabilityComponent extends ControlComponent<DisabilityDto> {
}
