import {Component} from '@angular/core';
import {Catalog, DataService} from "@app/services/data.service";
import {SimpleCatalogComponent} from "@app/components/data-management/catalog/simple-catalog/simple-catalog.component";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {ScienceAreaDto} from "@app/dto/ScienceAreaDto";

@Component({
    selector: 'app-science-area',
    template: `
    <h5 class="mb-3">{{header}}</h5>
    <div class="list-group">

      <app-filter [fields]="_searchFields" (onFilterChanged)="onFilterChanged()"></app-filter>

      <div [loadingData]="_loading">

        <!--ADD ITEM-->
        <div (click)="addItem()">
          <div class="list-group-item selectable link background-dark-sea-green">
            {{addLabel}}
          </div>
        </div>

        <!--ITEMS-->
        <div *ngFor="let item of items; let areaInd = index">

          <!--ITEM HEADER-->
          <div class="list-group-item" [class.disabled]="item.disabled">
            <div class="text-mini font-weight-bold">
              {{itemLabel}}
              <span *ngIf="item.id == 0">(не сохранено)</span>
              <span *ngIf="item.disabled">(неактивная запись)</span>
            </div>
            <div class="row">
              <div class="col-11">{{item.name | orElse: 'наименование отсутствует'}}</div>
              <div class="col-1 text-right">
                <a *ngIf="!item.isEdit" class="btn btn-icon" (click)="editItem(item)">
                  <fa-icon icon="cog" size="lg"></fa-icon>
                </a>
              </div>
            </div>


            <!--EDIT ITEM-->
            <div *ngIf="item.isEdit" class="mt-05">
              <div *ngIf="item.id != 0" class="form-sub-group">
                <app-checkbox [(ngModel)]="editedItem.disabled">
                  Неактивная запись (более не актуальна)
                </app-checkbox>
              </div>
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
                <button class="btn btn-secondary" (click)="cancelEditItem()">Отмена</button>
                <button class="btn btn-primary" (click)="saveEditedItem()">Сохранить</button>
                <button *ngIf="selectedItem.id == 0" class="btn btn-danger" (click)="deleteItem(areaInd)">
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!items || items.length == 0">
          <div class="italic list-group-item background-light-blue">
            {{noItemsLabel}}
          </div>
        </div>

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
export class ScienceAreaComponent extends SimpleCatalogComponent<ScienceAreaDto> {

  constructor(toasty: GlobalToastyService, dataService: DataService) {
    super(toasty, dataService);
    this.header = "Справочник отраслей наук";
    this.addLabel = "Добавить отрасль наук";
    this.itemLabel = "отрасль наук";
    this.noItemsLabel = "Отрасли наук отсутствуют";
    this.type = Catalog.SCIENCE_AREA;
  }
}
