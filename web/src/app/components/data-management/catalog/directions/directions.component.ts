import {ChangeDetectorRef, Component} from '@angular/core';
import {Catalog, DataService} from "app/services/data.service";
import {CatalogDto} from "@app/dto/CatalogDto";
import {CatalogTemplate} from "@app/components/data-management/catalog/CatalogTemplate";
import {DirectionDto} from "@app/dto/DirectionDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {SubDirectionDto} from "@app/dto/SubDirectionDto";
import {createTrackKeyStore, isEmptyOrNull} from "@app/support/utils";

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
      @for (item of items; track directionTrackKey(item); let areaInd = $index) {
        <div>
          <!--ITEM HEADER-->
          <div class="list-group-item" [class.disabled]="item.disabled">
            <div class="text-mini font-weight-bold">
              "приоритетное направление научных исследований и (или) научно-технической деятельности"
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
                    @if (type == 'direction') {
                      <div class="form-group">
                        <div class="form-group m-1">
                          Направление
                          <button type="button" class="btn btn-primary" [disabled]="!subDirInput || !subDirInput.trim()" (click)="addSubDir()">+</button>
                        </div>
                        <input [(ngModel)]="subDirInput" type="text" placeholder="направление" class="form-control" title="Направление">
                      </div>
                    }
                    <div>
                      @for (it of editedItem.subDirectionDtos; track subDirTrackKey(it); let i = $index) {
                        <div class="d-flex gap-2 align-items-center mt-2">
                          <input type="text" [(ngModel)]="editedItem.subDirectionDtos[i].directionName"
                                 placeholder="направление" class="form-control" title="Направление">
                          @if (isNewSubDir(it)) {
                            <button type="button" class="btn btn-danger btn-sm" (click)="removeSubDir(i)" title="Удалить направление">
                              <fa-icon icon="trash-alt"></fa-icon>
                            </button>
                          }
                        </div>
                      }
                    </div>
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
              "Приоритетные направления научных исследований и (или) научно-технической деятельности отсутствуют"
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
export class DirectionsComponent <T extends DirectionDto> extends CatalogTemplate<T> {

  constructor(public _toasty: GlobalToastyService,
              public _dataService: DataService,
              private cdr: ChangeDetectorRef) {
    super(_toasty, _dataService);
  }
  _type = Catalog.DIRECTION;

  subDirInput: string = '';

  // Стабильные trackKey без мутации DTO (WeakMap).
  private readonly _directionTrackKey = createTrackKeyStore<DirectionDto>('direction:');
  private readonly _subDirTrackKey = createTrackKeyStore<SubDirectionDto>('sub-direction:');

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
    const value = (this.subDirInput ?? '').trim();
    if (isEmptyOrNull(value)) {
      // Не бросаем исключение: это ломает UX и может ломать zoneless/OnPush сценарии.
      this._toasty.warn('Введите направление в поле.');
      return;
    }

    if (!this.editedItem) {
      this._toasty.error('Нельзя добавить направление: запись не выбрана для редактирования.');
      return;
    }

    const exists = (this.editedItem.subDirectionDtos ?? []).some(sd =>
      ((sd?.directionName ?? '').trim().toLowerCase() === value.toLowerCase())
    );
    if (exists) {
      this._toasty.warn('Такое направление уже добавлено.');
      return;
    }

    const sdDto: SubDirectionDto = new SubDirectionDto();
    // Явно помечаем как "новое" для бэка (id будет сгенерирован).
    // Если id в базовом IdDto не допускает null по типам — TS всё равно пропустит в runtime.
    (sdDto as any).id = null;
    sdDto.directionName = value;

    // Иммутабельное обновление массива — лучше для OnPush/zoneless.
    this.editedItem.subDirectionDtos = [sdDto, ...(this.editedItem.subDirectionDtos ?? [])];
    this.subDirInput = '';
    this.cdr?.markForCheck?.();
  }

  directionTrackKey(item: DirectionDto): string | number {
    // id=0 — локальная несохранённая запись
    if (item?.id && item.id !== 0) {
      return item.id;
    }
    return this._directionTrackKey(item);
  }

  subDirTrackKey(item: SubDirectionDto): string | number {
    // id может отсутствовать/быть 0 для новой записи
    if ((item as any)?.id && (item as any).id !== 0) {
      return (item as any).id;
    }
    return this._subDirTrackKey(item);
  }

  isNewSubDir(item: SubDirectionDto): boolean {
    // Для существующих поднаправлений удаление может быть запрещено на бэке (используются в проектах/связях).
    // Показываем кнопку удаления только для "локально добавленных" (id ещё нет или id == 0).
    return !item?.id;
  }

  removeSubDir(index: number) {
    if (!this.editedItem) {
      return;
    }
    const list = this.editedItem.subDirectionDtos ?? [];
    if (index < 0 || index >= list.length) {
      return;
    }
    this.editedItem.subDirectionDtos = list.filter((_, i) => i !== index);
    this.cdr?.markForCheck?.();
  }

  // Для новой записи (id=0) editedItem === selectedItem, поэтому "Отмена" иначе оставляет введённые данные в списке.
  // Здесь делаем ожидаемое поведение: отмена создания удаляет несохранённую запись.
  override cancelEditItem() {
    const item = this.selectedItem;
    if (item?.id === 0 && this.items) {
      const idx = this.items.indexOf(item);
      if (idx >= 0) {
        this.items.splice(idx, 1);
      }
      this.subDirInput = '';
      this.cdr?.markForCheck?.();
    }
    super.cancelEditItem();
  }
}

