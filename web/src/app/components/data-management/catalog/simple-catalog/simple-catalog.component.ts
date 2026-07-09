import {ChangeDetectionStrategy, Component, computed, input, signal} from '@angular/core';
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {CatalogTemplate} from "@app/components/data-management/catalog/CatalogTemplate";
import {CatalogDto} from "@app/dto/CatalogDto";
import {DataService} from "@app/services/data.service";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-simple-catalog',
    template: `<div class="simple-catalog">
  <!-- Заголовок с кнопкой добавления -->
  <div class="catalog-header">
    <h2 class="catalog-title">{{headerValue()}}</h2>
    <button type="button" class="btn-add" (click)="addItem()">
      <fa-icon icon="plus" class="btn-add-icon"></fa-icon>
      <span>{{addLabelValue()}}</span>
    </button>
  </div>

  <!-- Фильтр -->
  <div class="catalog-filter">
    <app-filter [fields]="_searchFields" (onFilterChanged)="onFilterChanged()"></app-filter>
  </div>

  <!-- Контент -->
  <div [loadingData]="_loading" class="catalog-content">
    @if (items && items.length > 0) {
      <div class="catalog-items">
        @for (item of items; track trackByItem($index, item); let areaInd = $index) {
          <div class="catalog-item" 
               [class.item-disabled]="item.disabled" 
               [class.item-editing]="item.isEdit"
               (click)="!item.isEdit && editItem(item)"
               [style.cursor]="item.isEdit ? 'default' : 'pointer'">
            @if (!item.isEdit) {
              <div class="item-content">
                <div class="item-main">
                  <div class="item-header">
                    <span class="item-label">{{itemLabelValue()}}</span>
                    @if (item.id == 0) {
                      <span class="badge badge-warning">
                        не сохранено
                      </span>
                    }
                    @if (item.disabled) {
                      <span class="badge badge-secondary">
                        неактивная запись
                      </span>
                    }
                  </div>
                  <div class="item-name">{{item.name | orElse: 'наименование отсутствует'}}</div>
                </div>
                <button type="button" 
                        class="btn-edit" 
                        (click)="editItem(item); $event.stopPropagation()" 
                        title="Редактировать">
                  <fa-icon icon="cog"></fa-icon>
                </button>
              </div>
            }

            @if (item.isEdit) {
              <div class="item-edit-form">
                @if (item.id != 0) {
                  <div class="form-group-checkbox">
                    <app-checkbox [(ngModel)]="editedItem.disabled">
                      Неактивная запись (более не актуальна)
                    </app-checkbox>
                  </div>
                }

                <div class="form-group">
                  <label class="form-label">Наименование</label>
                  <textarea
                    [(ngModel)]="editedItem.name"
                    placeholder="Введите наименование"
                    class="form-textarea"
                    title="Наименование"
                    rows="3"
                    autofocus
                  ></textarea>
                </div>

                <div class="form-actions" (click)="$event.stopPropagation()">
                  <button type="button" class="btn btn-cancel" (click)="cancelEditItem(); $event.stopPropagation()">
                    Отмена
                  </button>
                  <button type="button" class="btn btn-save" (click)="saveEditedItem()">
                    Сохранить
                  </button>
                  @if (selectedItem && selectedItem.id == 0) {
                    <button type="button" class="btn btn-delete" (click)="deleteItem(areaInd)">
                      <fa-icon icon="trash-alt" class="btn-icon"></fa-icon>
                      Удалить
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Пагинация -->
      <div class="catalog-pagination">
        <app-pagination
          [page]="_page" [pagination]="_pagination"
          (onPageChanged)="onPageChanged($event)">
        </app-pagination>
      </div>
    } @else if (!_loading) {
      <div class="catalog-empty">
        <div class="empty-state">
          <fa-icon icon="list" class="empty-icon"></fa-icon>
          <p class="empty-text">{{noItemsLabelValue()}}</p>
        </div>
      </div>
    }
  </div>
</div>`,
    styleUrls: ['./simple-catalog.component.scss'],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
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

  protected _addLabel = signal<string | undefined>(undefined);
  protected _itemLabel = signal<string | undefined>(undefined);
  protected _noItemsLabel = signal<string | undefined>(undefined);
  protected _header = signal<string | undefined>(undefined);

  readonly addLabelValue = computed(() => this._addLabel() ?? this.addLabel() ?? '');
  readonly itemLabelValue = computed(() => this._itemLabel() ?? this.itemLabel() ?? '');
  readonly noItemsLabelValue = computed(() => this._noItemsLabel() ?? this.noItemsLabel() ?? '');
  readonly headerValue = computed(() => this._header() ?? this.header() ?? '');

  ngOnInit() {
    super.ngOnInit();
    this._searchFields = [
      SearchField.contains('name').setSortDirection(Direction.ASC)
        .setPlaceholder('Поиск по наименованию...').setSortable(true),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
    // Инициализируем items как пустой массив, чтобы избежать ошибок при первом рендере
    if (!this.items) {
      this.items = [];
    }
    // Загружаем данные после инициализации
    this.update();
  }

  create(): T {
    return <T>new CatalogDto();
  }

  trackByItem(index: number, item: T): any {
    return item?.id || index;
  }
}
