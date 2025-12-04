import {Component, EventEmitter, forwardRef, HostListener, Output, input} from '@angular/core';
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
    <div class="dropdown btn-group" [class.show]="isOpen">
      <button [disabled]="disabled()" type="button" class="btn btn-outline-primary dropdown-toggle"
        [class.reset-available]="resetAvailable()" 
        (click)="toggleDropdown()"
        [attr.aria-expanded]="isOpen">
        {{optionAsString(_value)}}
      </button>
      <ul class="dropdown-menu scrollable-menu" [class.show]="isOpen" role="menu">
        @for (option of options(); track option) {
          <li class="dropdown-item" (click)="select(option)">
            {{optionAsString(option)}}
          </li>
        }
        @if (isOptionsEmpty()) {
          <li class="dropdown-item disabled italic">
            {{emptyOptionsLabel()}}
          </li>
        }
      </ul>
      @if (resetAvailable()) {
        <button [disabled]="disabled()" (click)="reset()" type="button" class="btn btn-outline-primary reset">
          <fa-icon icon="times"></fa-icon>
        </button>
      }
    </div>
    `,
    providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR],
    standalone: false
})
export class DropdownComponent<T> extends ControlComponent<T> {

  readonly disabled = input<boolean>(false);
  readonly options = input<T[]>(undefined);
  readonly resetEnabled = input<boolean>(true);
  readonly notSelected = input<string>('Ничего не выбрано');
  readonly emptyOptionsLabel = input<string>('Данные отсутствуют');
  readonly optionToString = input<Function>(undefined);
  @Output() onSelected: EventEmitter<T> = new EventEmitter<T>();

  isOpen: boolean = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isOpen = false;
    }
  }

  toggleDropdown() {
    if (!this.disabled()) {
      this.isOpen = !this.isOpen;
    }
  }

  select(option: T) {
    this.value = option;
    this.onSelected.emit(option);
    this.isOpen = false;
  }

  resetAvailable() {
    return this.resetEnabled() && this._value;
  }

  reset() {
    this.select(null);
  }

  isOptionsEmpty() {
    const options = this.options();
    return !options || options.length == 0;
  }

  optionAsString(option) {
    if (option == null) {
      return this.notSelected();
    }
    const optionToString = this.optionToString();
    if (optionToString) {
      return optionToString(option);
    }
    return option.name ? option.name : (option.directionName ? option.directionName : option.toString());
  }
}

