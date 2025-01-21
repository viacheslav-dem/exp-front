import {Component} from '@angular/core';
import {PropertyComponent} from "@app/components/settings/property.component";
import {getAllAuditTypes} from "@app/pipes/audit-type.pipe";

@Component({
  selector: 'app-audit-policy',
  template: `
    <div class="list-group-item">

      <!--SHOW-->
      <ng-container *ngIf="!isEdit">
        <div class="col-12">
          <h4 class="pull-left">Типы событий аудита</h4>
          <a class="btn btn-icon float-right" (click)="edit()">
            <fa-icon icon="cog" size="lg"></fa-icon>
          </a>
        </div>
        
        <div class="row col-12" *ngFor="let t of types">
          <div class="col-6">
            {{t | auditType}}
          </div>
          <div class="col-6">
            <label *ngIf="value.auditTypes[t]" style="color: forestgreen;">Включен</label>
            <label *ngIf="!value.auditTypes[t]" style="color: red;">Выключен</label>
          </div>
        </div>
      </ng-container>

      <!--EDIT-->
      <ng-container *ngIf="isEdit">
        <div class="form-group" *ngFor="let t of types">
          <app-checkbox [(ngModel)]="editedValue.auditTypes[t]">
            {{t | auditType}}
          </app-checkbox>
        </div>
        <div class="mt-1">
          <button class="btn btn-secondary" (click)="isEdit = false">Отмена</button>
          <button class="btn btn-primary" (click)="savePropertyValue()">Сохранить</button>
        </div>
      </ng-container>
    </div>
  `,
  styles: []
})
export class AuditPolicyComponent extends PropertyComponent<AuditPolicy> {
  types: string[] = getAllAuditTypes();
}


export class AuditPolicy {

}