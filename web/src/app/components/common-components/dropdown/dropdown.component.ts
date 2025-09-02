import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {SubDirectionDto} from "@app/dto/SubDirectionDto";

export const DROPDOWN_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DropdownComponent),
  multi: true
};

@Component({
  selector: 'app-dropdown',
  styleUrls: ['dropdown.component.scss'],
  template: `
    <div class="dropdown btn-group">
      <button [disabled]="disabled" type="button" class="btn btn-outline-primary dropdown-toggle"
              [class.reset-available]="resetAvailable()" data-toggle="dropdown">
        {{optionAsString(_value)}}
      </button>
      <ul class="dropdown-menu scrollable-menu" role="menu">
        <li *ngFor="let option of options" class="dropdown-item" (click)="select(option)">
          {{optionAsString(option)}}
        </li>
        <li *ngIf="isOptionsEmpty()" class="dropdown-item disabled italic">
          {{emptyOptionsLabel}}
        </li>
      </ul>
      <button [disabled]="disabled" *ngIf="resetAvailable()" (click)="reset()" type="button" class="btn btn-outline-primary reset">
        <fa-icon icon="times"></fa-icon>
      </button>
    </div>
  `,
  providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR]
})
export class DropdownComponent<T> extends ControlComponent<T> {

  @Input() disabled: boolean = false;
  @Input() options: T[];
  @Input() resetEnabled: boolean = true;
  @Input() notSelected: string = 'Ничего не выбрано';
  @Input() emptyOptionsLabel: string = 'Данные отсутствуют';
  @Input() optionToString: Function;
  @Output() onSelected: EventEmitter<T> = new EventEmitter<T>();

  select(option: T) {
    this.value = option;
    this.onSelected.emit(option);
  }

  resetAvailable() {
    return this.resetEnabled && this._value;
  }

  reset() {
    this.select(null);
  }

  isOptionsEmpty() {
    return !this.options || this.options.length == 0;
  }

  optionAsString(option) {
    if (option == null) {
      return this.notSelected;
    }
    if (this.optionToString) {
      return this.optionToString(option);
    }
    return option.name ? option.name : (option.directionName ? option.directionName : option.toString());
  }
}

