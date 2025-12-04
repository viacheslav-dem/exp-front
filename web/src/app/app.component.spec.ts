import { AppComponent } from './app.component';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

class BsLocaleServiceMock {
  usedLocales: string[] = [];

  use(locale: string) {
    this.usedLocales.push(locale);
  }
}

class FaIconLibraryMock {
  addIconsCalls: any[][] = [];

  addIcons(...icons: any[]) {
    this.addIconsCalls.push(icons);
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let localeService: BsLocaleServiceMock;
  let iconLibrary: FaIconLibraryMock;

  beforeEach(() => {
    localeService = new BsLocaleServiceMock();
    iconLibrary = new FaIconLibraryMock();

    component = new AppComponent(
      localeService as unknown as BsLocaleService,
      iconLibrary as unknown as FaIconLibrary
    );
  });

  // проверяет, что компонент успешно создаётся с переданными зависимостями
  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  // проверяет, что при создании компонента устанавливается локаль datepicker на "ru"
  it('should set datepicker locale to ru on construction', () => {
    expect(localeService.usedLocales).toContain('ru');
  });

  // проверяет, что при создании компонента регистрируются иконки в FaIconLibrary
  it('should register fontawesome icons on construction', () => {
    expect(iconLibrary.addIconsCalls.length).toBeGreaterThan(0);

    const icons = iconLibrary.addIconsCalls[0];
    expect(icons.length).toBeGreaterThan(0);
  });
});
