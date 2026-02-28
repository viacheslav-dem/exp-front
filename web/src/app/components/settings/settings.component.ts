import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ViewContainerRef, AfterViewInit, viewChild} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {timer} from 'rxjs';
import {GlobalToastyService} from "app/services/global-toasty.service";
import {DataService} from "@app/services/data.service";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {PropertyPlainDto} from "@app/dto/PropertyPlainDto";
import {compareByField} from "@app/support/utils";
import {PropertyDto} from "@app/dto/PropertyDto";
import {
  PropertyComponentResolver
} from "@app/components/settings/property-component-resolver.service";
import {PropertyComponent} from "@app/components/settings/property.component";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.settings) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class SettingsComponent extends FilterAndPages<PropertyDto> implements AfterViewInit {

  properties: PropertyDto[] = [];
  selectedProperty: PropertyDto;
  editedProperty: PropertyPlainDto;
  private _pendingPropertySelection: PropertyDto;

  readonly propertyContainer = viewChild('propertyContainer', { read: ViewContainerRef });
  propertyComponent: PropertyComponent<any>;

  constructor(private _toasty: GlobalToastyService,
              private _dataService: DataService,
              private _propertyComponentResolver: PropertyComponentResolver,
              private _resolver: ComponentFactoryResolver,
              private cdr: ChangeDetectorRef) {
    super(10);
  }

  ngOnInit() {
    this._searchFields = [
      SearchField.contains('description').setPlaceholder('Поиск по описанию...')
        .setSortable(true).setSortDirection(Direction.ASC),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
    this.enableFilterCache("properties");
    // Если нет сохранённого состояния фильтров, загружаем данные явно
    timer(100).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const hasCachedFilters = localStorage.getItem('filter_cache_properties');
      if (!hasCachedFilters) {
        this.update();
      }
    });
  }

  ngAfterViewInit() {
    // Если была отложенная выборка свойства, выполняем её после инициализации представления
    if (this._pendingPropertySelection) {
      this.selectProperty(this._pendingPropertySelection);
      this._pendingPropertySelection = null;
    }
  }

  loadPage() {
    this._dataService.getPropertiesAdminPage(this._searchRequest).subscribe(res => {
      this.setLoading(false);
      this._page = res;
      this.properties = this._page.content;
      if (this.properties && this.properties.length > 0) {
        // Если propertyContainer еще не инициализирован, откладываем выборку
        if (this.propertyContainer()) {
          this.selectProperty(this.properties[0]);
        } else {
          this._pendingPropertySelection = this.properties[0];
        }
      }
      this.cdr?.markForCheck?.();
    }, () => {
      this.setLoading(false);
      this.cdr?.markForCheck?.();
    });
  }

  selectProperty(property: PropertyDto) {
    if (this.selectedProperty) {
      this.selectedProperty.isEdit = false;
    }
    this.selectedProperty = property;
    // show tooltips
    this.updatePropertyComponent();
    this.cdr?.markForCheck?.();
  }

  editProperty() {
    this.selectedProperty.isEdit = true;
    this.editedProperty = SettingsComponent.copyProperty(this.selectedProperty);
  }

  cancelEditProperty() {
    this.selectedProperty.isEdit = false;
  }

  getSelectedPropertyInd() {
    return this.properties.findIndex(property => property == this.selectedProperty);
  }

  saveEditedProperty() {
    this._dataService.saveProperty(this.editedProperty).subscribe(res => {
      this._toasty.success("Сохранено.");
      this.properties[this.getSelectedPropertyInd()] = res;
      this.selectProperty(res);
      SettingsComponent.sortProperties(this.properties);
      this.cdr?.markForCheck?.();
    });
  }

  updatePropertyComponent() {
    const propertyContainer = this.propertyContainer();
    if (!propertyContainer || !this.selectedProperty) {
      return;
    }
    while (propertyContainer.length > 0) {
      propertyContainer.get(0).destroy();
    }
    let renderer = this._propertyComponentResolver.getRenderer(this.selectedProperty.type);
    if (!renderer) {
      this.propertyComponent = null;
    } else {
      const componentFactory = this._resolver.resolveComponentFactory(renderer);
      const componentRef = propertyContainer.createComponent(componentFactory);
      this.propertyComponent = componentRef.instance as PropertyComponent<any>;
      this.propertyComponent.setProperty(this.selectedProperty);
    }
  }

  static copyProperty(property: PropertyPlainDto): PropertyPlainDto {
    return Object.assign(new PropertyPlainDto(), property);
  }

  static sortProperties(properties: PropertyPlainDto[]) {
    properties.sort(compareByField('description'))
  }
}
