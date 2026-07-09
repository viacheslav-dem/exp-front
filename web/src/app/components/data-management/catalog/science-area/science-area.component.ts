import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Catalog, DataService} from "@app/services/data.service";
import {SimpleCatalogComponent} from "@app/components/data-management/catalog/simple-catalog/simple-catalog.component";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {ScienceAreaDto} from "@app/dto/ScienceAreaDto";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-science-area',
    template: `
    <h5 class="mb-3">{{headerValue()}}</h5>
    <div class="list-group">
    
      <app-filter [fields]="_searchFields" (onFilterChanged)="onFilterChanged()"></app-filter>
    
      <div [loadingData]="_loading">
    
        <!--ADD ITEM-->
        <div (click)="addItem()">
          <div class="list-group-item selectable link background-dark-sea-green">
            {{addLabelValue()}}
          </div>
        </div>
    
        <!--ITEMS-->
        @for (item of items; track item; let areaInd = $index) {
          <div>
            <!--ITEM HEADER-->
            <div class="list-group-item" [class.disabled]="item.disabled">
              <div class="text-mini font-weight-bold">
                {{itemLabelValue()}}
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
                    <div class="form-group">
                      <div>Наименование в родительном падеже</div>
                      <input type="text" [(ngModel)]="editedItem.nameInGen"
                        placeholder="например, технических наук" class="form-control" title="Наименование в родительном падеже">
                      </div>
                      <div class="mt-1">
                        <button class="btn btn-secondary me-2" (click)="cancelEditItem()">Отмена</button>
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
                  {{noItemsLabelValue()}}
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
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class ScienceAreaComponent extends SimpleCatalogComponent<ScienceAreaDto> {

  constructor(toasty: GlobalToastyService, dataService: DataService) {
    super(toasty, dataService);
    this._header.set("Справочник отраслей наук");
    this._addLabel.set("Добавить отрасль наук");
    this._itemLabel.set("отрасль наук");
    this._noItemsLabel.set("Отрасли наук отсутствуют");
    this._type = Catalog.SCIENCE_AREA;
  }
}
