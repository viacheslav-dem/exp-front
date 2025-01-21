import {Component, Directive, forwardRef} from '@angular/core';
import {ControlComponent} from "app/components/common-components/control-component";
import {BankAccountDto} from "app/dto/BankAccountDto";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {getAllBankAccountTypes} from "@app/pipes/bank-account-type.pipe";

export const BANK_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BankAccountComponent),
  multi: true
};

@Component({
  selector: 'app-bank-account',
  template: `
    <ng-container *ngIf="_value!=null">
      <label class="form-group-label">Банковские реквизиты в ОПЕРУ ОАО «АСБ Беларусбанк»</label>
      <div class="form-sub-group">
        <div class="input-group btn-group separated">
          <app-date-input
              class="width-auto" [(ngModel)]="_value.accountTerms" [title]="'Срок действия счёта'"
              [placement]="'top'" [placeholder]="'Срок действия счёта'"
          >
          </app-date-input>
          <input accountInput type="text" class="form-control"
                 style="border-bottom-right-radius: 0 !important;border-top-right-radius: 0 !important;"
                 [(ngModel)]="_value.account"
                 title="Номер счёта" placeholder="BY_ _АКВВ_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _">
          <button type="button" class="btn btn-primary dropdown-toggle"
                  data-toggle="dropdown">
            {{_value?.type | bankAccountType}}
          </button>
          <ul class="dropdown-menu scrollable-menu">
            <li *ngFor="let type of allBankAccountTypes" class="dropdown-item"
                (click)="_value.type = type">
              {{type | bankAccountType}}
            </li>
          </ul>
        </div>
      </div>
    </ng-container>
  `,
  providers: [BANK_CONTROL_VALUE_ACCESSOR]
})
export class BankAccountComponent extends ControlComponent<BankAccountDto> {

  allBankAccountTypes = getAllBankAccountTypes();

}

