import {Component, forwardRef, OnDestroy, OnInit, input} from '@angular/core';
import {DataService} from "@app/services/data.service";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";
import {CatalogDto} from "@app/dto/CatalogDto";
import {Subscription} from "rxjs";

export const CATALOG_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectCatalogComponent),
  multi: true
};

@Component({
    selector: 'app-select-catalog',
    template: `
    <app-dropdown 
      [(ngModel)]="value" [notSelected]="notSelected()" [options]="options"
      [resetEnabled]="resetEnabled()" [optionToString]="optionToString()"
    ></app-dropdown>
  `,
    providers: [CATALOG_CONTROL_VALUE_ACCESSOR],
    standalone: false
})
export class SelectCatalogComponent extends ControlComponent<CatalogDto> implements OnInit, OnDestroy {

  readonly resetEnabled = input<boolean>(true);
  readonly catalog = input<string>(undefined);
  readonly notSelected = input<string>('Ничего не выбрано');
  readonly optionToString = input<Function>(undefined);

  options: CatalogDto[] = [];
  private subscription: Subscription;

  constructor(private dataService: DataService) {
    super();
  }

  ngOnInit(): void {
    this.subscription = this.dataService.getCatalog<CatalogDto>(this.catalog()).subscribe(res => {
      this.options = res;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
