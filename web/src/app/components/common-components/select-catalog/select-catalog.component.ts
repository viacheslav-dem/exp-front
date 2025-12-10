import {Component, forwardRef, input} from '@angular/core';
import {DataService} from "@app/services/data.service";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";
import {CatalogDto} from "@app/dto/CatalogDto";

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
export class SelectCatalogComponent extends ControlComponent<CatalogDto> {

  readonly resetEnabled = input<boolean>(true);
  readonly catalog = input<string>(undefined);
  readonly notSelected = input<string>('Ничего не выбрано');
  readonly optionToString = input<Function>(undefined);

  options: CatalogDto[] = [];

  constructor(private dataService: DataService) {
    super();
  }

  ngOnInit(): void {
    this.dataService.getCatalog<CatalogDto>(this.catalog()).subscribe(res => {
      this.options = res
    });
  }
}
