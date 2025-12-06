import {Component} from '@angular/core';
import {Catalog, DataService} from "app/services/data.service";
import {CatalogDto} from "@app/dto/CatalogDto";
import {CatalogTemplate} from "@app/components/data-management/catalog/CatalogTemplate";
import {DirectionDto} from "@app/dto/DirectionDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {SubDirectionDto} from "@app/dto/SubDirectionDto";
import {isEmptyOrNull} from "@app/support/utils";

@Component({
  selector: 'app-directions',
  template: `<h5 class="mb-3">"Справочник приоритетных направлений научных исследований и (или) научно-технической деятельности"</h5>
  <div class="list-group">

    <app-filter [fields]="_searchFields" (onFilterChanged)="onFilterChanged()"></app-filter>

    <div [loadingData]="_loading">

      <!--ADD ITEM-->
      <div (click)="addItem()">
        <div class="list-group-item selectable link background-dark-sea-green">
          "Добавить приоритетное направление научных исследований и (или) научно-технической деятельности"
        </div>
      </div>

      <!--ITEMS-->
      <div *ngFor="let item of items; let areaInd = index">

        <!--ITEM HEADER-->
        <div class="list-group-item" [class.disabled]="item.disabled">
          <div class="text-mini font-weight-bold">
            "приоритетное направление научных исследований и (или) научно-технической деятельности"
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
              <div class="form-group" *ngIf="type == 'direction'">
                <div class="form-group m-1">Направление <button class="btn btn-primary" (click)="addSubDir()">+</button> </div>
                <input [(ngModel)]="subDirInput" type="text" placeholder="направление" class="form-control" title="Направление">
              </div>
              <div>
                <input *ngFor="let it of editedItem.subDirectionDtos; let i = index" type="text" [(ngModel)]="editedItem.subDirectionDtos[i].directionName"
                       placeholder="направление" class="form-control" title="Направление">
              </div>
              
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
          "Приоритетные направления научных исследований и (или) научно-технической деятельности отсутствуют"
        </div>
      </div>

      <app-pagination
          [page]="_page" [pagination]="_pagination"
          (onPageChanged)="onPageChanged($event)">
      </app-pagination>
    </div>
  </div>
  `,
  styles: []
})
export class DirectionsComponent <T extends DirectionDto> extends CatalogTemplate<T> {

  constructor(public _toasty: GlobalToastyService,
              public _dataService: DataService) {
    super(_toasty, _dataService);
  }
  type = Catalog.DIRECTION;

  subDirInput: string;

  ngOnInit() {
    this._searchFields = [
      SearchField.contains('name').setSortDirection(Direction.ASC)
          .setPlaceholder('Поиск по наименованию...').setSortable(true),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
  }

  // saveEditedItem() {
  //   this._dataService.saveDirection(this.editedItem).subscribe(() => {
  //     this._toasty.success("Сохранено.");
  //     this.update();
  //   });
  // }

  create(): T {
    return <T>new DirectionDto();
  }

  addSubDir() {
    if(isEmptyOrNull(this.subDirInput)){
      throw "Введите направление в поле.";
    } else{
      let length = this.editedItem.subDirectionDtos.length;
      let sdDto: SubDirectionDto  = new SubDirectionDto();
      sdDto.id = null;
      sdDto.directionName = this.subDirInput;
      this.editedItem.subDirectionDtos[length] = sdDto;
    }
  }
}

