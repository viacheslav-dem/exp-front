import {Component} from '@angular/core';
import {Catalog, DataService} from "@app/services/data.service";
import {SimpleCatalogComponent} from "@app/components/data-management/catalog/simple-catalog/simple-catalog.component";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {TariffRateDto} from "@app/dto/TariffRateDto";

@Component({
    selector: 'app-tariff',
    template: `
    <h5 class="mb-3">{{header}}</h5>
    <div class="list-group">
    
      <!--      <app-filter [fields]="_searchFields" (onFilterChanged)="onFilterChanged()"></app-filter>-->
    
      <div [loadingData]="_loading">
    
        <!--ADD ITEM-->
        <div (click)="addItem()">
          <div class="list-group-item selectable link background-dark-sea-green">
            {{addLabel}}
          </div>
        </div>
    
        <!--ITEMS-->
        @for (item of items; track item; let areaInd = $index) {
          <div>
            <!--ITEM HEADER-->
            <div class="list-group-item" [class.disabled]="item.disabled">
              <div class="text-mini font-weight-bold">
                {{itemLabel}}
                @if (item.id == 0) {
                  <span>(не сохранено)</span>
                }
                @if (item.disabled) {
                  <span>(неактивная запись)</span>
                }
              </div>
              <div class="row">
                <div class="col-11">
                  <div>{{item.name | orElse: 'наименование отсутствует'}}</div>
                  <div>Коэффициент для экспертных организаций: {{item.expertOrg}}</div>
                  <div>Коэффициент для доктора наук: {{item.doctor}}</div>
                  <div>Коэффициент для кандидата наук: {{item.candidate}}</div>
                  <div>Коэффициент для экспертов без научной степени: {{item.withoutDegree}}</div>
                  <div>Коэффициент для членов экспертного совета: {{item.councilMember}}</div>
                </div>
                <div class="col-1 text-right">
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
                      <div>Коэффициент для экспертных организаций</div>
                      <input type="number" [(ngModel)]="editedItem.expertOrg" numberInput
                        class="form-control" title="Коэффициент для экспертных организаций">
                        <div>Коэффициент для доктора наук</div>
                        <input type="number" [(ngModel)]="editedItem.doctor" numberInput
                          class="form-control" title="Коэффициент для доктора наук">
                          <div>Коэффициент для кандидата наук</div>
                          <input type="number" [(ngModel)]="editedItem.candidate" numberInput
                            class="form-control" title="Коэффициент для кандидата наук">
                            <div>Коэффициент для экспертов без научной степени</div>
                            <input type="number" [(ngModel)]="editedItem.withoutDegree" numberInput
                              class="form-control" title="Коэффициент для экспертов без научной степени">
                              <div>Коэффициент для членов экспертного совета</div>
                              <input type="number" [(ngModel)]="editedItem.councilMember" numberInput
                                class="form-control" title="Коэффициент для членов экспертного совета">
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
                          {{noItemsLabel}}
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
export class TariffComponent extends SimpleCatalogComponent<TariffRateDto> {

  constructor(toasty: GlobalToastyService, dataService: DataService) {
    super(toasty, dataService);
    this.header = "Справочник тарифов";
    this.addLabel = "Добавить тариф";
    this.itemLabel = "тариф";
    this.noItemsLabel = "Тарифы отсутствуют";
    this.type = Catalog.TARIFF;
  }
}
