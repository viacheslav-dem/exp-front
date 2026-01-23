import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SimpleCatalogComponent } from './simple-catalog.component';
import { GlobalToastyService } from '@app/services/global-toasty.service';
import { DataService } from '@app/services/data.service';
import { CatalogDto } from '@app/dto/CatalogDto';
import { Catalog } from '@app/services/data.service';
import { of, throwError } from 'rxjs';
import { Page } from '@app/components/common-components/page-and-filter/model/Page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { FilterComponent } from '@app/components/common-components/page-and-filter/filter/filter.component';
import { CheckboxComponent } from '@app/components/common-components/checkbox/checkbox.component';
import { PaginationComponent } from '@app/components/common-components/page-and-filter/pagination/pagination.component';
import { LoadingDataDirective } from '@app/components/common-components/loading-data/loading-data.directive';
import { OrElsePipe } from '@app/pipes/or-else.pipe';
import { CustomPipesModule } from '@app/pipes/custom-pipes.module';
import { 
  faCog, 
  faSortAmountUp, 
  faAngleDoubleLeft, 
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

// Моки сервисов
class GlobalToastyServiceMock {
  successCalls: string[] = [];
  errorCalls: string[] = [];

  success(message: string) {
    this.successCalls.push(message);
  }

  error(message: string) {
    this.errorCalls.push(message);
  }
}

class DataServiceMock {
  getCatalogAdminPageCalls: any[] = [];
  saveCatalogCalls: any[] = [];

  getCatalogAdminPage<T>(catalog: Catalog, request: any) {
    this.getCatalogAdminPageCalls.push({ catalog, request });
    const page = new Page<T>();
    page.content = [
      { id: 1, name: 'Item 1' } as T,
      { id: 2, name: 'Item 2' } as T
    ];
    page.totalElements = 2;
    page.totalPages = 1;
    page.page = 1;
    return of(page);
  }

  saveCatalog<T>(catalog: Catalog, item: T) {
    this.saveCatalogCalls.push({ catalog, item });
    return of(item);
  }
}

describe('SimpleCatalogComponent', () => {
  let component: SimpleCatalogComponent<CatalogDto>;
  let fixture: ComponentFixture<SimpleCatalogComponent<CatalogDto>>;
  let toastyService: GlobalToastyServiceMock;
  let dataService: DataServiceMock;

  beforeEach(async () => {
    toastyService = new GlobalToastyServiceMock();
    dataService = new DataServiceMock();

    await TestBed.configureTestingModule({
      declarations: [
        SimpleCatalogComponent,
        FilterComponent,
        CheckboxComponent,
        PaginationComponent,
        LoadingDataDirective,
        OrElsePipe
      ],
      imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule
      ],
      providers: [
        { provide: GlobalToastyService, useValue: toastyService },
        { provide: DataService, useValue: dataService }
      ]
    }).compileComponents();

    // Регистрация иконок FontAwesome
    const iconLibrary = TestBed.inject(FaIconLibrary);
    iconLibrary.addIcons(faCog, faSortAmountUp, faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight, faPlus);

    fixture = TestBed.createComponent(SimpleCatalogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('type', Catalog.SCIENCE_AREA);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should handle addLabel input signal', () => {
      fixture.componentRef.setInput('addLabel', 'Добавить элемент');
      fixture.detectChanges();
      expect(component.addLabelValue()).toBe('Добавить элемент');
    });

    it('should handle itemLabel input signal', () => {
      fixture.componentRef.setInput('itemLabel', 'Элемент');
      fixture.detectChanges();
      expect(component.itemLabelValue()).toBe('Элемент');
    });

    it('should handle noItemsLabel input signal', () => {
      fixture.componentRef.setInput('noItemsLabel', 'Нет элементов');
      fixture.detectChanges();
      expect(component.noItemsLabelValue()).toBe('Нет элементов');
    });

    it('should handle header input signal', () => {
      fixture.componentRef.setInput('header', 'Заголовок');
      fixture.detectChanges();
      expect(component.headerValue()).toBe('Заголовок');
    });

    it('should return empty string when input signals are undefined', () => {
      expect(component.addLabelValue()).toBe('');
      expect(component.itemLabelValue()).toBe('');
      expect(component.noItemsLabelValue()).toBe('');
      expect(component.headerValue()).toBe('');
    });

    it('should prioritize protected fields over input signals', () => {
      component['_addLabel'].set('Protected Label');
      fixture.componentRef.setInput('addLabel', 'Signal Label');
      fixture.detectChanges();
      expect(component.addLabelValue()).toBe('Protected Label');
    });
  });

  describe('Rendering', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.update();
      fixture.detectChanges();
    });

    it('should initialize search fields in ngOnInit', () => {
      expect(component._searchFields.length).toBeGreaterThan(0);
      expect(component._searchFields[0].key).toBe('name');
    });

    it('should render items list when items exist', () => {
      component.items = [
        { id: 1, name: 'Item 1' } as CatalogDto,
        { id: 2, name: 'Item 2' } as CatalogDto
      ];
      fixture.detectChanges();

      expect(component.items.length).toBe(2);
    });

    it('should track items by id in trackByItem', () => {
      const item1 = { id: 1, name: 'Item 1' } as CatalogDto;
      const item2 = { id: 2, name: 'Item 2' } as CatalogDto;

      const track1 = component.trackByItem(0, item1);
      const track2 = component.trackByItem(1, item2);

      expect(track1).toBe(1);
      expect(track2).toBe(2);
    });

    it('should track items by index when id is missing', () => {
      const item = { id: null, name: 'Item' } as CatalogDto;
      const track = component.trackByItem(5, item);
      expect(track).toBe(5);
    });
  });

  describe('Outputs and interactions', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.items = [
        { id: 1, name: 'Item 1', isEdit: false } as CatalogDto
      ];
    });

    it('should create new item when addItem is called', () => {
      const initialLength = component.items ? component.items.length : 0;
      component.addItem();

      expect(component.items.length).toBe(initialLength + 1);
      expect(component.items[0].id).toBe(0);
      expect(component.selectedItem.isEdit).toBe(true);
    });

    it('should edit item when editItem is called', () => {
      const item = { id: 1, name: 'Item 1', isEdit: false } as CatalogDto;
      component.items = [item];

      component.editItem(item);

      expect(component.selectedItem).toBe(item);
      expect(item.isEdit).toBe(true);
      expect(component.editedItem).toBeTruthy();
    });

    it('should cancel edit when cancelEditItem is called', () => {
      const item = { id: 1, name: 'Item 1', isEdit: true } as CatalogDto;
      component.selectedItem = item;

      component.cancelEditItem();

      expect(item.isEdit).toBe(false);
    });

    it('should save edited item when saveEditedItem is called', () => {
      const item = { id: 1, name: 'Item 1', isEdit: true } as CatalogDto;
      component.selectedItem = item;
      component.editedItem = { id: 1, name: 'Updated Item', isEdit: true } as CatalogDto;
      fixture.componentRef.setInput('type', Catalog.SCIENCE_AREA);

      component.saveEditedItem();
      fixture.detectChanges();

      expect(dataService.saveCatalogCalls.length).toBe(1);
      expect(toastyService.successCalls).toContain('Сохранено.');
    });

    it('should delete item when deleteItem is called', () => {
      component.items = [
        { id: 0, name: 'Item 1' } as CatalogDto,
        { id: 1, name: 'Item 2' } as CatalogDto
      ];

      component.deleteItem(0);

      expect(component.items.length).toBe(1);
      expect(component.items[0].id).toBe(1);
    });
  });

  describe('create method', () => {
    it('should create new CatalogDto instance', () => {
      const item = component.create();
      expect(item).toBeInstanceOf(CatalogDto);
      expect(item.id).toBe(0);
    });
  });

  describe('Data loading', () => {
    it('should load page data when update is called', fakeAsync(() => {
      fixture.componentRef.setInput('type', Catalog.SCIENCE_AREA);
      component.ngOnInit();

      component.update();
      tick(0); // Ждём выполнения setTimeout для setLoading
      fixture.detectChanges();

      expect(dataService.getCatalogAdminPageCalls.length).toBeGreaterThan(0);
    }));

    it('should handle loading state during data fetch', fakeAsync(() => {
      fixture.componentRef.setInput('type', Catalog.SCIENCE_AREA);
      component.ngOnInit();

      component.update();
      tick(0); // Ждём выполнения setTimeout для setLoading(true)

      expect(component._loading).toBe(true);
      
      tick(100); // Ждём завершения асинхронного запроса
      fixture.detectChanges();
      
      // После завершения загрузки _loading должен быть false
      expect(component._loading).toBe(false);
    }));
  });
});

