import {Component, input} from '@angular/core';
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {CatalogTemplate} from "@app/components/data-management/catalog/CatalogTemplate";
import {CatalogDto} from "@app/dto/CatalogDto";
import {DataService} from "@app/services/data.service";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";

@Component({
    selector: 'app-simple-catalog',
    template: `<h5 class="mb-3">{{headerValue}}</h5>
  <div class="list-group">
  
    <app-filter [fields]="_searchFields" (onFilterChanged)="onFilterChanged()"></app-filter>
  
    <div [loadingData]="_loading">
  
      <!--ADD ITEM-->
      <div (click)="addItem()">
        <div class="list-group-item selectable link background-dark-sea-green">
          {{addLabelValue}}
        </div>
      </div>
  
      <!--ITEMS-->
      @for (item of items; track item; let areaInd = $index) {
        <div>
          <!--ITEM HEADER-->
          <div class="list-group-item" [class.disabled]="item.disabled">
            <div class="text-mini font-weight-bold">
              {{itemLabelValue}}
              @if (item.id == 0) {
                <span>(не сохранено)</span>
              }
              @if (item.disabled) {
                <span>(неактивная запись)</span>
              }
            </div>
            <div class="row">
              <div class="col-11">{{item.name | orElse: 'наименование отсутствует'}}</div>
              <div class="col-1 text-end">
                @if (!item.isEdit) {
                  <a class="btn btn-icon" (click)="editItem(item)">
                    <fa-icon icon="cog" size="lg"></fa-icon>
                  </a>
                }
              </div>
            </div>
            <!--EDIT ITEM-->
            @if (item.isEdit) {
              <div class="mt-05">
                @if (item.id != 0) {
                  <div class="form-sub-group">
                    <app-checkbox [(ngModel)]="editedItem.disabled">
                      Неактивная запись (более не актуальна)
                    </app-checkbox>
                  </div>
                }
                <div class="form-group">
                  <div>Наименование</div>
                  <input type="text" [(ngModel)]="editedItem.name"
                    placeholder="наименование" class="form-control" title="Наименование">
                  </div>
                  <div class="mt-1">
                    <button class="btn btn-secondary" (click)="cancelEditItem()">Отмена</button>
                    <button class="btn btn-primary" (click)="saveEditedItem()">Сохранить</button>
                    @if (selectedItem.id == 0) {
                      <button class="btn btn-danger" (click)="deleteItem(areaInd)">
                        Удалить
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
  
        @if (!items || items.length == 0) {
          <div>
            <div class="italic list-group-item background-light-blue">
              {{noItemsLabelValue}}
            </div>
          </div>
        }
  
        <app-pagination
          [page]="_page" [pagination]="_pagination"
          (onPageChanged)="onPageChanged($event)">
        </app-pagination>
      </div>
    </div>
  `,
    styles: [],
    standalone: false
})
export class SimpleCatalogComponent<T extends CatalogDto> extends CatalogTemplate<T> {

  constructor(public _toasty: GlobalToastyService,
              public _dataService: DataService) {
    super(_toasty, _dataService);
  }

  readonly addLabel = input<string>(undefined);
  readonly itemLabel = input<string>(undefined);
  readonly noItemsLabel = input<string>(undefined);
  readonly header = input<string>(undefined);

  protected _addLabel: string;
  protected _itemLabel: string;
  protected _noItemsLabel: string;
  protected _header: string;

  get addLabelValue(): string {
    return this._addLabel ?? this.addLabel() ?? '';
  }

  get itemLabelValue(): string {
    return this._itemLabel ?? this.itemLabel() ?? '';
  }

  get noItemsLabelValue(): string {
    return this._noItemsLabel ?? this.noItemsLabel() ?? '';
  }

  get headerValue(): string {
    return this._header ?? this.header() ?? '';
  }

  ngOnInit() {
    this._searchFields = [
      SearchField.contains('name').setSortDirection(Direction.ASC)
        .setPlaceholder('Поиск по наименованию...').setSortable(true),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
  }

  create(): T {
    return <T>new CatalogDto();
  }
}
