import {ChangeDetectionStrategy, Component, forwardRef} from '@angular/core';
import {ControlComponent} from "app/components/common-components/control-component";
import {PassportDto} from "app/dto/PassportDto";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {environment} from "../../../../environments/environment";

export const PASSPORT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PassportComponent),
  multi: true
};
@Component({
    selector: 'app-passport',
    template: `
    @if (_value!=null) {
      <label class="form-group-label">Паспорт</label>
      <div class="form-sub-group">
        <label>Серия и номер</label>
        <div class="input-group separated">
          <input class="form-control" type="text" title="Серия" placeholder="Серия" style="max-width: 100px;"
            [(ngModel)]="_value.series"/>
            <input class="form-control" type="text" title="Номер" placeholder="Номер"
              [(ngModel)]="_value.number"/>
            </div>
          </div>
          <div class="form-sub-group">
            <label>Идентификационный номер</label>
            <input class="form-control" type="text" title="Идентификационный номер"
              placeholder="Идентификационный номер"
              [(ngModel)]="_value.idNumber"/>
            </div>
            <div class="form-sub-group">
              <label>Когда и кем выдан</label>
              <div class="input-group separated">
                <app-date-input class="width-auto" [(ngModel)]="_value.startDate" [title]="'Дата выдачи'"></app-date-input>
                <input class="form-control width-auto" type="text" title="Кем выдан" placeholder="Кем выдан"
                  [(ngModel)]="_value.authority" />
                </div>
              </div>
            }
    `,
    providers: [PASSPORT_CONTROL_VALUE_ACCESSOR],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.commonControls)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class PassportComponent extends ControlComponent<PassportDto> {

}
