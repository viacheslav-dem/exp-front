import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {CatalogDto} from "@app/dto/CatalogDto";
import { ChangeDetectorRef, computed, Directive, effect, inject, input } from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {timer} from 'rxjs';
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {Catalog, DataService} from "@app/services/data.service";
import * as _ from "lodash";
import {DirectionDto} from "@app/dto/DirectionDto";
import {environment} from "../../../../environments/environment";

@Directive()
export abstract class CatalogTemplate<T extends CatalogDto> extends FilterAndPages<T> {

  // Для постепенного перехода на OnPush/zoneless: даём базовому классу возможность дернуть markForCheck
  // без изменения конструкторов наследников.
  private readonly _cdr = inject(ChangeDetectorRef, { optional: true });

  items: T[];
  selectedItem: T;
  editedItem: T;

  readonly typeInput = input<Catalog>(undefined, { alias: 'type' });
  // Совместимость с наследниками, где _type задаётся как поле класса.
  protected _type: Catalog | undefined;
  readonly typeSignal = computed(() => this._type ?? this.typeInput());

  get type(): Catalog {
    return this.typeSignal();
  }

  constructor(public _toasty: GlobalToastyService,
              public _dataService: DataService,
              itemsPerPage?: number) {
    super(itemsPerPage);
  }

  protected loadPage() {
    this._dataService.getCatalogAdminPage<T>(this.type, this._searchRequest).subscribe(res => {
      this.setLoading(false);
      this._page = res;
      this.items = this._page.content;
      if (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin) {
        this._cdr?.markForCheck();
      }
    }, () => this.setLoading(false));
  }

  editItem(item: T) {
    if (this.selectedItem) {
      this.selectedItem.isEdit = false;
    }

    this.selectedItem = item;
    this.editedItem = (item.id == 0 ?
      this.selectedItem : _.cloneDeep(this.selectedItem));
    this.selectedItem.isEdit = true;
    if (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin) {
      this._cdr?.markForCheck();
    }
  }

  cancelEditItem() {
    if (this.selectedItem) {
      const item = this.selectedItem;
      item.isEdit = false;
      if (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin) {
        this._cdr?.markForCheck();
      }
      // Очищаем selectedItem после обновления представления
      timer(0).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.selectedItem = null;
        if (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin) {
          this._cdr?.markForCheck();
        }
      });
    }
  }

  saveEditedItem() {
    this._dataService.saveCatalog<T>(this.type, this.editedItem).subscribe(() => {
      this._toasty.success("Сохранено.");
      this.update();
    });
  }

  deleteItem(areaInd) {
    this.items.splice(areaInd, 1);
    if (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin) {
      this._cdr?.markForCheck();
    }
  }

  addItem() {
    let newItem = this.create();
    this.items.unshift(newItem);
    this.editItem(newItem);
    if (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin) {
      this._cdr?.markForCheck();
    }
  }

  abstract create():T;
}
