import {Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
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

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent extends FilterAndPages<PropertyDto> {

  properties: PropertyDto[] = [];
  selectedProperty: PropertyDto;
  editedProperty: PropertyPlainDto;

  @ViewChild('propertyContainer', { read: ViewContainerRef, static: false }) propertyContainer: any;
  propertyComponent: PropertyComponent<any>;

  constructor(private _toasty: GlobalToastyService,
              private _dataService: DataService,
              private _propertyComponentResolver: PropertyComponentResolver,
              private _resolver: ComponentFactoryResolver) {
    super(10);
  }

  ngOnInit() {
    this._searchFields = [
      SearchField.contains('description').setPlaceholder('Поиск по описанию...')
        .setSortable(true).setSortDirection(Direction.ASC),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
    this.enableFilterCache("properties");
  }

  loadPage() {
    this._dataService.getPropertiesAdminPage(this._searchRequest).subscribe(res => {
      this.setLoading(false);
      this._page = res;
      this.properties = this._page.content;
      this.selectProperty(this.properties[0])
    }, () => this.setLoading(false));
  }

  selectProperty(property: PropertyDto) {
    if (this.selectedProperty) {
      this.selectedProperty.isEdit = false;
    }
    this.selectedProperty = property;
    // show tooltips
    setTimeout(() => $('.propertyType[data-toggle="tooltip"]')['tooltip'](), 500);
    this.updatePropertyComponent();
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
    });
  }

  updatePropertyComponent() {
    while (this.propertyContainer.length > 0) {
      this.propertyContainer.get(0).destroy();
    }
    let renderer = this._propertyComponentResolver.getRenderer(this.selectedProperty.type);
    if (!renderer) {
      this.propertyComponent = null;
    } else {
      let componentFactory = this._resolver.resolveComponentFactory(renderer);
      this.propertyComponent = this.propertyContainer.createComponent(componentFactory)._component;
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
