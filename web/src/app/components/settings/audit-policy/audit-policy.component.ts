import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {getAllAuditTypes} from "@app/pipes/audit-type.pipe";
import {DataService} from "@app/services/data.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";

@Component({
    selector: 'app-audit-policy',
    template: `
    <div class="list-group-item">
    
      <!--SHOW-->
      @if (!isEdit) {
        <div class="col-12">
          <h4 class="pull-left">Типы событий аудита</h4>
          <a class="btn btn-icon float-right" (click)="edit()">
            <fa-icon icon="cog" size="lg"></fa-icon>
          </a>
        </div>
        @for (t of types; track t) {
          <div class="row col-12">
            <div class="col-6">
              {{t | auditType}}
            </div>
            <div class="col-6">
              @if (value.auditTypes[t]) {
                <label style="color: forestgreen;">Включен</label>
              }
              @if (!value.auditTypes[t]) {
                <label style="color: red;">Выключен</label>
              }
            </div>
          </div>
        }
      }
    
      <!--EDIT-->
      @if (isEdit) {
        @for (t of types; track t) {
          <div class="form-group">
            <app-checkbox [(ngModel)]="editedValue.auditTypes[t]">
              {{t | auditType}}
            </app-checkbox>
          </div>
        }
        <div class="mt-1">
          <button class="btn btn-secondary" (click)="isEdit = false">Отмена</button>
          <button class="btn btn-primary" (click)="savePropertyValue()">Сохранить</button>
        </div>
      }
    </div>
    `,
    styles: [],
    standalone: false
})
export class AuditPolicyComponent extends PropertyComponent<AuditPolicy> {
  types: string[] = getAllAuditTypes();

  constructor(protected _dataService: DataService,
              protected _toasty: GlobalToastyService) {
    super(_dataService, _toasty);
  }
}


export class AuditPolicy {

}