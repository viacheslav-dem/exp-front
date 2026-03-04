import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, viewChild} from '@angular/core';
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {PersonService} from "@app/services/person.service";
import {Catalog, DataService} from "@app/services/data.service";
import {PersonDto} from "@app/dto/PersonDto";
import {IdNameDto} from "@app/dto/IdNameDto";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {
  Direction,
  sortByName,
  SortClass,
  SortOrder,
  switchDirection
} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {RolePipe} from "@app/pipes/role.pipe";
import {DegreeTypePipe, getAllDegreeTypes} from "@app/pipes/degree.pipe";
import {Subscription, timer} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AcademicTitleTypePipe, getAllAcademicTitleTypes} from "@app/pipes/academic-title.pipe";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {LastSignEnumPipe} from "@app/pipes/last-sign.pipe";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['user-list.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.coreShell) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class UserListComponent extends FilterAndPages<PersonDto> implements OnDestroy {

  SortClass = SortClass;
  readonly showUserInfo = viewChild<ModalComponent>('showUserInfo');
  users: PersonDto[] = [];
  selectedUser: PersonDto;
  sortOrder: SortOrder = new SortOrder('person', Direction.ASC);
  onPersonListChangedSubscription: Subscription;
  filterCollapsed: boolean = true; // По умолчанию фильтр закрыт на маленьких экранах

  constructor(private toasty: GlobalToastyService,
              private _personService: PersonService,
              private _dataService: DataService,
              private _dialogService: DialogService,
              private _academicTitleTypePipe: AcademicTitleTypePipe,
              private _rolePipe: RolePipe,
              private _lastSignPipe: LastSignEnumPipe,
              private _degreeTypePipe: DegreeTypePipe,
              private cdr: ChangeDetectorRef) {
    super(10);
  }

  ngOnInit() {
    this._searchFields = [
      SearchField.startsWith('personName.lastName')
        .setTitle('Пользователь').setPlaceholder('Поиск по фамилии...'),
      SearchField.multiSelect('roles', this._rolePipe.getAllRoles(), value => this._rolePipe.transform(value))
        .setSelectText('Выбрать роль').setCheckAllEnabled(true).setTitle('Роль'),
      SearchField.multiSelect('org', [])
        .setSelectText('Выбрать организацию').setSearchFilterEnabled(true).setTitle('Организация'),
      SearchField.multiSelect('areas', []).setSelectText('Выбрать область компетенции')
        .setSearchFilterEnabled(true).setTitle('Область компетенции'),
      SearchField.multiSelect('personInfo.fullDegrees.degreeType', getAllDegreeTypes(), value => this._degreeTypePipe.transform(value))
        .setSelectText("Выбрать учёную степень").setTitle('Учёная степень'),
      SearchField.multiSelect('personInfo.fullDegrees.scienceArea', []).setSelectText('Выбрать отрасль науки')
        .setSearchFilterEnabled(true).setTitle('Отрасль науки'),
      SearchField.multiSelect('personInfo.academicTitleType', getAllAcademicTitleTypes(), value => this._academicTitleTypePipe.transform(value))
        .setSelectText("Выбрать учёное звание").setTitle('Учёное звание'),
      SearchField.multiSelect('personInfo.specialities', []).setSelectText('Выбрать специальности')
        .setSearchFilterEnabled(true).setTitle('Специальность'),
      SearchField.multiSelect('personInfo.specializations', []).setSelectText('Выбрать специализации')
        .setSearchFilterEnabled(true).setTitle('Специализация'),
      SearchField.multiSelect('personInfo.lastSignState', this._lastSignPipe.getAllSignTypes(), value => this._lastSignPipe.transform(value))
          .setSelectText('Выбрать роль').setCheckAllEnabled(true).setTitle('Последний вход'),
    ];
    
    // Подписка на изменения списка пользователей
    // ВАЖНО: не вызываем update() до загрузки кэша фильтров, чтобы не сбросить фильтры
    this.onPersonListChangedSubscription = this._personService.onPersonListChanged.subscribe(() => {
      // Вызываем update() только если начальная загрузка завершена
      // Это предотвращает вызов update() до загрузки фильтров из кэша
      if (this._initialLoadDone) {
        this.update();
      }
    });
    
    // Загружаем каталоги и после их загрузки включаем кэш фильтров
    // Это нужно, чтобы multiSelect поля были готовы к загрузке значений из кэша
    let catalogsLoaded = 0;
    const totalCatalogs = 5; // areas, speciality, specialization, scienceArea, orgs
    
    const checkCatalogsAndEnableCache = () => {
      catalogsLoaded++;
      if (catalogsLoaded >= totalCatalogs) {
        // Все каталоги загружены, теперь можно безопасно загружать кэш
        this.enableFilterCache("users");
        // enableFilterCache вызывает update() если есть сохраненное состояние
        // Если кэша нет, загружаем данные без фильтров после завершения enableFilterCache
        timer(300).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          if (!localStorage.getItem('filter_cache_users')) {
            this.update();
          }
        });
      }
    };
    
    // Подписываемся на загрузку каталогов
    this._dataService.getCatalog(Catalog.AREA_OF_COMPETENCE).subscribe((areas: IdNameDto[]) => {
      this.getSearchField('areas').setItems(areas);
      this.cdr?.markForCheck?.();
      checkCatalogsAndEnableCache();
    });
    this._dataService.getCatalog(Catalog.SPECIALITY).subscribe((speciality: IdNameDto[]) => {
      this.getSearchField('personInfo.specialities').setItems(speciality);
      this.cdr?.markForCheck?.();
      checkCatalogsAndEnableCache();
    });
    this._dataService.getCatalog(Catalog.SPECIALIZATION).subscribe((specialization: IdNameDto[]) => {
      this.getSearchField('personInfo.specializations').setItems(specialization);
      this.cdr?.markForCheck?.();
      checkCatalogsAndEnableCache();
    });
    this._dataService.getCatalog(Catalog.SCIENCE_AREA).subscribe((scienceArea: IdNameDto[]) => {
      this.getSearchField('personInfo.fullDegrees.scienceArea').setItems(scienceArea);
      this.cdr?.markForCheck?.();
      checkCatalogsAndEnableCache();
    });
    this._dataService.getOrgs().subscribe(orgs => {
      this.getSearchField('org').setItems(orgs);
      this.cdr?.markForCheck?.();
      checkCatalogsAndEnableCache();
    });
  }

  ngOnDestroy(): void {
    if (this.onPersonListChangedSubscription) {
      this.onPersonListChangedSubscription.unsubscribe();
    }
  }

  loadPage() {
    if (this.shouldSkipLoadPage()) {
      return;
    }
    
    this._personService.getPersons(this._searchRequest).subscribe(res => {
      this._page = res;
      this.users = res.content;
      this.setLoading(false);
      this.cdr?.markForCheck?.();
    }, () => {
      this.setLoading(false);
      this.cdr?.markForCheck?.();
    });
  }

  showEditUserModal(user: PersonDto) {
    if (user == null) {
      user = new PersonDto();
    }
    this._dialogService.showUserDialog(user, false).subscribe(dlgResult => {
      this._personService.saveOrUpdatePerson(dlgResult.value).subscribe(() => {
        this.toasty.success("Профиль сохранён.");
        dlgResult.dlg.forceClose();
        this.update();
      });
    });
  }

  showReadUserModal(user: PersonDto){
    this.selectedUser = user;
    this.showUserInfo()?.show();
    this.cdr?.markForCheck?.();
  }

  deletePerson(user: PersonDto) {
    this._dialogService.showConfirmDialog("Удаление учетной записи",
      "Вы действительно хотите удалить учетную запись пользователя?",
      "При успешном удалении последующее восстановление невозможно").subscribe(
      () => this._personService.deletePerson(user.id).subscribe(
        () => {
          this.toasty.success("Пользователь успешно удален");
          user.deleted = true;
        }
      )
    )
  }

  getSortOrders() {
    if (this.sortOrder.property == 'person') {
      return sortByName('personName.', this.sortOrder.direction);
    } else {
      return [this.sortOrder];
    }
  }

  sortBy(property: string) {
    if (property == this.sortOrder.property) {
      this.sortOrder.direction = switchDirection(this.sortOrder.direction, false);
    } else {
      this.sortOrder.direction = Direction.ASC;
    }
    this.sortOrder.property = property;
    this.update();
  }

  toggleFilter() {
    this.filterCollapsed = !this.filterCollapsed;
    this.cdr?.markForCheck?.();
  }

}
