import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {CatalogDto} from "@app/dto/CatalogDto";
import { Directive, input, Input } from "@angular/core";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {Catalog, DataService} from "@app/services/data.service";
import * as _ from "lodash";
import {DirectionDto} from "@app/dto/DirectionDto";

@Directive()
export abstract class CatalogTemplate<T extends CatalogDto> extends FilterAndPages<T> {

  items: T[];
  selectedItem: T;
  editedItem: T;

  readonly typeInput = input<Catalog>(undefined);
  protected _type: Catalog;

  @Input()
  set type(value: Catalog) {
    this._type = value;
  }

  get type(): Catalog {
    return this._type ?? this.typeInput();
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
  }

  cancelEditItem() {
    this.selectedItem.isEdit = false;
  }

  saveEditedItem() {
    this._dataService.saveCatalog<T>(this.type, this.editedItem).subscribe(() => {
      this._toasty.success("Сохранено.");
      this.update();
    });
  }

  deleteItem(areaInd) {
    this.items.splice(areaInd, 1);
  }

  addItem() {
    let newItem = this.create();
    this.items.unshift(newItem);
    this.editItem(newItem);
  }

  abstract create():T;
}
