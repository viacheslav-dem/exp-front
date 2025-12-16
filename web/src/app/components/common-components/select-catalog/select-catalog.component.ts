import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnDestroy, OnInit, input} from '@angular/core';
import {DataService} from "@app/services/data.service";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "@app/components/common-components/control-component";
import {CatalogDto} from "@app/dto/CatalogDto";
import {Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";

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
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: environment.features.onPush.selectCatalog ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class SelectCatalogComponent extends ControlComponent<CatalogDto> implements OnInit, OnDestroy {

  readonly resetEnabled = input<boolean>(true);
  readonly catalog = input<string>(undefined);
  readonly notSelected = input<string>('Ничего не выбрано');
  readonly optionToString = input<Function>(undefined);

  options: CatalogDto[] = [];
  private subscription: Subscription;

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscription = this.dataService.getCatalog<CatalogDto>(this.catalog()).subscribe(res => {
      this.options = res;
      // Важно для OnPush/zoneless: данные пришли асинхронно
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
