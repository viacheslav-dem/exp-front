import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {getAllPhoneTypes} from "@app/pipes/phone-type.pipe";
import {AutoActivatedRole, Role, RolePipe} from "@app/pipes/role.pipe";
import {getAllBankAccountTypes} from "@app/pipes/bank-account-type.pipe";
import {PersonDto} from "@app/dto/PersonDto";
import {PhoneDto} from "@app/dto/PhoneDto";
import {PersonInfoDto} from "@app/dto/PersonInfoDto";
import {PassportDto} from "@app/dto/PassportDto";
import {BankAccountDto} from "@app/dto/BankAccountDto";
import {DisabilityDto} from "@app/dto/DisabilityDto";
import {Catalog, DataService} from "@app/services/data.service";
import {AuthService} from "@app/services/auth.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {SERVER_URL} from "@app/config";
import {PersonService} from "@app/services/person.service";
import {getAllDegreeTypes} from "@app/pipes/degree.pipe";
import {deepClone, isDeepEqual, isEmptyOrNull} from "@app/support/utils";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {IdDto} from "@app/dto/IdDto";
import {PersonNameDto} from "@app/dto/PersonNameDto";
import {getAllAcademicTitleTypes} from "@app/pipes/academic-title.pipe";
import {FullDegreeDto} from "@app/dto/FullDegreeDto";
import {SectionPipe} from "@app/pipes/section.pipe";
import {SelectItem} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Subject, of, Subscription} from "rxjs";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import {SearchPageRequest} from "@app/components/common-components/page-and-filter/model/SearchPageRequest";
import {Pagination} from "@app/components/common-components/page-and-filter/model/Pagination";
import {SortOrder, Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {CatalogDto} from "@app/dto/CatalogDto";

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
    standalone: false
})
export class UserFormComponent implements OnInit, OnDestroy {

  SERVER_URL = SERVER_URL;
  AutoActivatedRole = AutoActivatedRole;
  Role = Role;
  role: string;
  _user: PersonDto;
  _originalUser: PersonDto;
  _userSelectedOrg: SelectItem = null;
  photo: string = 'assets/abstract_profile.jpg';
  current: boolean = false;
  Catalog = Catalog;
  scienceAreaToString = (area) => area.nameInGen;

  allRoles: string[] = [];
  allPhoneTypes: string[] = getAllPhoneTypes();
  allDegreeTypes: string[] = getAllDegreeTypes();
  allAcademicTitleTypes: string[] = getAllAcademicTitleTypes();
  allBankAccountTypes: string[] = getAllBankAccountTypes();
  allScienceArea: any[] = [];
  allOrgs: SelectItem[] = [];
  
  private subscriptions: Subscription[] = [];

  // Lazy loading для специальностей - независимые данные для каждого списка по индексу
  specialityItemsMap: Map<number, CatalogDto[]> = new Map();
  specialityLoadingMap: Map<number, boolean> = new Map();
  specialitySearchInputMap: Map<number, Subject<string>> = new Map();
  specialityPageMap: Map<number, number> = new Map();
  specialityHasMoreMap: Map<number, boolean> = new Map();
  specialityCurrentSearchMap: Map<number, string> = new Map();

  // Lazy loading для специализаций - независимые данные для каждого списка по индексу
  specializationItemsMap: Map<number, CatalogDto[]> = new Map();
  specializationLoadingMap: Map<number, boolean> = new Map();
  specializationSearchInputMap: Map<number, Subject<string>> = new Map();
  specializationPageMap: Map<number, number> = new Map();
  specializationHasMoreMap: Map<number, boolean> = new Map();
  specializationCurrentSearchMap: Map<number, string> = new Map();

  // Lazy loading для областей компетенции - независимые данные для каждого списка по индексу
  areaItemsMap: Map<number, CatalogDto[]> = new Map();
  areaLoadingMap: Map<number, boolean> = new Map();
  areaSearchInputMap: Map<number, Subject<string>> = new Map();
  areaPageMap: Map<number, number> = new Map();
  areaHasMoreMap: Map<number, boolean> = new Map();
  areaCurrentSearchMap: Map<number, string> = new Map();
  
  // Вспомогательные методы для получения/инициализации данных по индексу
  getSpecialityItems(index: number): CatalogDto[] {
    if (!this.specialityItemsMap.has(index)) {
      this.specialityItemsMap.set(index, []);
    }
    return this.specialityItemsMap.get(index);
  }
  
  getSpecializationItems(index: number): CatalogDto[] {
    if (!this.specializationItemsMap.has(index)) {
      this.specializationItemsMap.set(index, []);
    }
    return this.specializationItemsMap.get(index);
  }
  
  getAreaItems(index: number): CatalogDto[] {
    if (!this.areaItemsMap.has(index)) {
      this.areaItemsMap.set(index, []);
    }
    return this.areaItemsMap.get(index);
  }
  
  getSpecialitySearchInput$(index: number): Subject<string> {
    if (!this.specialitySearchInputMap.has(index)) {
      const subject = new Subject<string>();
      this.specialitySearchInputMap.set(index, subject);
      // Подписка на поиск для этого индекса
      subject.pipe(
        debounceTime(500), // Увеличиваем debounce для более плавного поиска
        distinctUntilChanged(),
        switchMap((searchTerm: string) => {
          const trimmedTerm = (searchTerm || '').trim();
          this.specialityCurrentSearchMap.set(index, trimmedTerm);
          
          // Если поисковый запрос меньше 2 символов, не делаем запрос к серверу
          if (trimmedTerm.length > 0 && trimmedTerm.length < 2) {
            // Очищаем результаты, но не загружаем новые
            const existingSelected = this._user?.personInfo?.specialities?.[index] ? [this._user.personInfo.specialities[index]].filter(s => s != null) as CatalogDto[] : [];
            this.specialityItemsMap.set(index, [...existingSelected]);
            this.specialityHasMoreMap.set(index, true);
            return of([]);
          }
          
          this.specialityPageMap.set(index, 0);
          const existingSelected = this._user?.personInfo?.specialities?.[index] ? [this._user.personInfo.specialities[index]].filter(s => s != null) as CatalogDto[] : [];
          this.specialityItemsMap.set(index, [...existingSelected]);
          this.specialityHasMoreMap.set(index, true);
          return this.loadSpecialities(true, index);
        })
      ).subscribe();
    }
    return this.specialitySearchInputMap.get(index);
  }
  
  getSpecializationSearchInput$(index: number): Subject<string> {
    if (!this.specializationSearchInputMap.has(index)) {
      const subject = new Subject<string>();
      this.specializationSearchInputMap.set(index, subject);
      // Подписка на поиск для этого индекса
      subject.pipe(
        debounceTime(500), // Увеличиваем debounce для более плавного поиска
        distinctUntilChanged(),
        switchMap((searchTerm: string) => {
          const trimmedTerm = (searchTerm || '').trim();
          this.specializationCurrentSearchMap.set(index, trimmedTerm);
          
          // Если поисковый запрос меньше 2 символов, не делаем запрос к серверу
          if (trimmedTerm.length > 0 && trimmedTerm.length < 2) {
            // Очищаем результаты, но не загружаем новые
            const existingSelected = this._user?.personInfo?.specializations?.[index] ? [this._user.personInfo.specializations[index]].filter(s => s != null) as CatalogDto[] : [];
            this.specializationItemsMap.set(index, [...existingSelected]);
            this.specializationHasMoreMap.set(index, true);
            return of([]);
          }
          
          this.specializationPageMap.set(index, 0);
          const existingSelected = this._user?.personInfo?.specializations?.[index] ? [this._user.personInfo.specializations[index]].filter(s => s != null) as CatalogDto[] : [];
          this.specializationItemsMap.set(index, [...existingSelected]);
          this.specializationHasMoreMap.set(index, true);
          return this.loadSpecializations(true, index);
        })
      ).subscribe();
    }
    return this.specializationSearchInputMap.get(index);
  }
  
  getAreaSearchInput$(index: number): Subject<string> {
    if (!this.areaSearchInputMap.has(index)) {
      const subject = new Subject<string>();
      this.areaSearchInputMap.set(index, subject);
      // Подписка на поиск для этого индекса
      subject.pipe(
        debounceTime(500), // Увеличиваем debounce для более плавного поиска
        distinctUntilChanged(),
        switchMap((searchTerm: string) => {
          const trimmedTerm = (searchTerm || '').trim();
          this.areaCurrentSearchMap.set(index, trimmedTerm);
          
          // Если поисковый запрос меньше 2 символов, не делаем запрос к серверу
          if (trimmedTerm.length > 0 && trimmedTerm.length < 2) {
            // Очищаем результаты, но не загружаем новые
            const existingSelected = this._user?.areas?.[index] ? [this._user.areas[index]].filter(a => a != null) as CatalogDto[] : [];
            this.areaItemsMap.set(index, [...existingSelected]);
            this.areaHasMoreMap.set(index, true);
            return of([]);
          }
          
          this.areaPageMap.set(index, 0);
          const existingSelected = this._user?.areas?.[index] ? [this._user.areas[index]].filter(a => a != null) as CatalogDto[] : [];
          this.areaItemsMap.set(index, [...existingSelected]);
          this.areaHasMoreMap.set(index, true);
          return this.loadAreas(true, index);
        })
      ).subscribe();
    }
    return this.areaSearchInputMap.get(index);
  }


  @Output() onSave = new EventEmitter<PersonDto>();
  @Output() canceled = new EventEmitter();

  constructor(private _dataService: DataService,
              private toasty: GlobalToastyService,
              private _authService: AuthService,
              private _rolePipe: RolePipe,
              private _personService: PersonService,
              private _dialogService: DialogService,
              private _sectionPipe: SectionPipe) {
    // Подписки теперь создаются динамически в методах getSpecialitySearchInput$, getSpecializationSearchInput$, getAreaSearchInput$
  }

  ngOnInit() {
    this.allRoles = this._rolePipe.getAllNotAutoActivatedRoles();
    this.role = this._authService.getCurrRole();
    // Убрали загрузку всех областей компетенции, специальностей и специализаций - теперь lazy loading
    this.subscriptions.push(
      this._dataService.getCatalog(Catalog.SCIENCE_AREA).subscribe(res => this.allScienceArea = res),
      this._dataService.getOrgs().subscribe(res => {
        this.allOrgs = res.map((item, ind) => new SelectItem(item, item.name, item.id));
      })
    );
  }
  
  ngOnDestroy() {
    // Отписываемся от всех подписок
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    
    // Завершаем все Subject'ы
    this.specialitySearchInputMap.forEach(subject => subject.complete());
    this.specializationSearchInputMap.forEach(subject => subject.complete());
    this.areaSearchInputMap.forEach(subject => subject.complete());
    
    // Очищаем все Map'ы
    this.specialityItemsMap.clear();
    this.specializationItemsMap.clear();
    this.areaItemsMap.clear();
    this.specialitySearchInputMap.clear();
    this.specializationSearchInputMap.clear();
    this.areaSearchInputMap.clear();
    this.specialityPageMap.clear();
    this.specializationPageMap.clear();
    this.areaPageMap.clear();
    this.specialityHasMoreMap.clear();
    this.specializationHasMoreMap.clear();
    this.areaHasMoreMap.clear();
    this.specialityCurrentSearchMap.clear();
    this.specializationCurrentSearchMap.clear();
    this.areaCurrentSearchMap.clear();
    this.specialityLoadingMap.clear();
    this.specializationLoadingMap.clear();
    this.areaLoadingMap.clear();
  }

  protected prepareUser(value?: PersonDto) {
    if (!value) value = new PersonDto();
    if (!value.phones) value.phones = [];
    if (!value.roles) value.roles = [];
    if (!value.areas) value.areas = [];
    if (!value.personName) value.personName = new PersonNameDto();
    if (!value.personInfo) value.personInfo = new PersonInfoDto();
    if (!value.personInfo.nameInDative) value.personInfo.nameInDative = new PersonNameDto();
    if (!value.personInfo.nameInGenitive) value.personInfo.nameInGenitive = new PersonNameDto();
    if (!value.personInfo.passport) value.personInfo.passport = new PassportDto();
    if (!value.personInfo.bankAccount) value.personInfo.bankAccount = new BankAccountDto();
    if (!value.personInfo.bankAccount.type) value.personInfo.bankAccount.type = this.allBankAccountTypes[0];
    if (!value.personInfo.disability) value.personInfo.disability = new DisabilityDto();
    if (!value.personInfo.fullDegrees) value.personInfo.fullDegrees = [];
    if (!value.personInfo.specialities) value.personInfo.specialities = [];
    if (!value.personInfo.specializations) value.personInfo.specializations = [];
    this.getPhoto(value);
    this._rolePipe.sortRoles(value.roles);
    return value;
  }

  @Input()
  set user(value: PersonDto) {
    this._originalUser = this.prepareUser(value);
    if (!value) {
      this._user = this.prepareUser();
    } else {
      this._user = deepClone(this._originalUser);
      this.current = this._user.current;
    }
    if (this._user.org) {
      this._userSelectedOrg = new SelectItem(this._user.org, this._user.org.name, this._user.org.id);
    } else {
      this._userSelectedOrg = null;
    }
    
    // Инициализируем данные для каждого существующего элемента
    // Очищаем старые данные и подписки
    this.specialityItemsMap.clear();
    this.specializationItemsMap.clear();
    this.areaItemsMap.clear();
    this.specialitySearchInputMap.forEach(subject => subject.complete());
    this.specializationSearchInputMap.forEach(subject => subject.complete());
    this.areaSearchInputMap.forEach(subject => subject.complete());
    this.specialitySearchInputMap.clear();
    this.specializationSearchInputMap.clear();
    this.areaSearchInputMap.clear();
    this.specialityPageMap.clear();
    this.specializationPageMap.clear();
    this.areaPageMap.clear();
    this.specialityHasMoreMap.clear();
    this.specializationHasMoreMap.clear();
    this.areaHasMoreMap.clear();
    this.specialityCurrentSearchMap.clear();
    this.specializationCurrentSearchMap.clear();
    this.areaCurrentSearchMap.clear();
    this.specialityLoadingMap.clear();
    this.specializationLoadingMap.clear();
    this.areaLoadingMap.clear();
    
    // Инициализируем данные для специальностей
    if (this._user.personInfo.specialities) {
      this._user.personInfo.specialities.forEach((speciality, index) => {
        if (speciality != null) {
          this.specialityItemsMap.set(index, [speciality] as CatalogDto[]);
        } else {
          this.specialityItemsMap.set(index, []);
        }
        this.specialityPageMap.set(index, 0);
        this.specialityHasMoreMap.set(index, true);
        this.specialityCurrentSearchMap.set(index, '');
      });
    }
    
    // Инициализируем данные для специализаций
    if (this._user.personInfo.specializations) {
      this._user.personInfo.specializations.forEach((specialization, index) => {
        if (specialization != null) {
          this.specializationItemsMap.set(index, [specialization] as CatalogDto[]);
        } else {
          this.specializationItemsMap.set(index, []);
        }
        this.specializationPageMap.set(index, 0);
        this.specializationHasMoreMap.set(index, true);
        this.specializationCurrentSearchMap.set(index, '');
      });
    }
    
    // Инициализируем данные для областей компетенции
    if (this._user.areas) {
      this._user.areas.forEach((area, index) => {
        if (area != null) {
          this.areaItemsMap.set(index, [area] as CatalogDto[]);
        } else {
          this.areaItemsMap.set(index, []);
        }
        this.areaPageMap.set(index, 0);
        this.areaHasMoreMap.set(index, true);
        this.areaCurrentSearchMap.set(index, '');
      });
    }
  };

  isExpert() {
    return this.hasRole(Role.EXPERT);
  }
  isAdmin() {
    return this._user.roles.find(r => r == this.Role.ADMIN);
  }

  hasRole(role: Role) {
    return this._user.roles.find(r => r == role);
  }

  addRole(roleV: string, i: number) {
    this._user.roles[i] = roleV;
  }

  save() {
    this.validate();
    this.onSave.emit(this._user);
  }

  validate() {
    if (isEmptyOrNull(this._user.personName.lastName) ||
      isEmptyOrNull(this._user.personName.firstName) ||
      isEmptyOrNull(this._user.personName.middleName)) {
      throw 'Поля "Фамилия", "Имя", "Отчество" обязательны для заполнения.';
    }
    if (this.hasRole(Role.CUSTOMER) && !this._user.org) {
      throw 'Поле "Организация" обязательно для заполнения при наличии роли "Заказчик".';
    }
    if (this._user.personInfo.bankAccount.account &&
      !this._user.personInfo.bankAccount.account.replace(/ /g, "")
        .match(/^BY\d{2}AKBB\d{20}$/)) {
      throw 'Поле "Номер счёта" (IBAN) имеет неверный формат.';
    }
    if (this._user.phones.length > 0) {
      for (let phone of this._user.phones) {
        if (!phone.phone.match(/\+375 \d{2} \d{7}/)) {
          throw "Номер телефона не соответствует формату: +375 XX XXXXXXX";
        }
      }
    }
    if (!this._user.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9-]+[A-Z0-9-.]*.[A-Z]{2,4}$/i)) {
      throw "Адрес электронной почты не соответствует формату";
    }
  }

  hasRights() {
    return this._user.roles.some(role => this.AutoActivatedRole[role]);
  }

  hasRoles() {
    return this._user.roles.some(role => !this.AutoActivatedRole[role]);
  }

  cancel() {
    this.canceled.emit();
  }

  resetPassword() {
    this._dialogService.showConfirmDialog('Сброс пароля', 'Вы действительно хотите сбросить пароль?',
      'Система сгенерирует и установит новый пароль и вышлет его на почту пользователя.').subscribe(() => {
      this._authService.resetPassword(this._user.id).subscribe(() => {
        this.toasty.success('Новый пароль установлен. Он выслан на почту пользователя, если она верно указана в профиле.');
      });
    });
  }

  toggleBlock() {
    if (this._user.user.blocked)
      this._authService.unblockUser(this._user.id).subscribe(usr => {
        this.toasty.success('Учетная запись разблокирована.');
        this._user.user.blocked = usr.blocked;
      });
    else
      this._authService.blockUser(this._user.id).subscribe(usr => {
        this.toasty.success('Учетная запись заблокирована.');
        this._user.user.blocked = usr.blocked;
      });
  }

  addPhone() {
    let phone = new PhoneDto();
    phone.type = this.allPhoneTypes[0];
    this._user.phones.push(phone);
  }

  // TrackBy функции для оптимизации рендеринга списков
  // В Angular 17+ track выражение получает только элемент, поэтому используем id или уникальный ключ
  trackByPhone(phone: PhoneDto): any {
    // Используем id если есть, иначе комбинацию свойств для уникальности
    return phone?.id || `${phone?.type || ''}-${phone?.phone || ''}`;
  }

  trackBySpeciality(speciality: CatalogDto): any {
    return speciality?.id || speciality?.name || null;
  }

  trackBySpecialization(specialization: CatalogDto): any {
    return specialization?.id || specialization?.name || null;
  }

  trackByArea(area: CatalogDto): any {
    return area?.id || area?.name || null;
  }

  trackByFullDegree(fd: FullDegreeDto): any {
    // Для новых элементов без id используем комбинацию свойств
    return fd?.id || `${fd?.degreeType || ''}-${fd?.scienceArea?.id || ''}-${fd?.degreeNumber || ''}`;
  }

  trackByRole(role: string): any {
    return role;
  }

  getPhoto(person: IdDto) {
    if (person.id != 0) {
      this._personService.getPhoto(person).subscribe(
        (res) => {
          if (res.name != null) {
            this.photo = "data:image/png;base64," + res.name;
          } else {
            this.photo = 'assets/abstract_profile.jpg';
          }
        },
        () => this.photo = 'assets/abstract_profile.jpg');
    } else {
      this.photo = 'assets/abstract_profile.jpg';
    }
  }

  getInfoForRole(role: string): string[] {
    let info = [];
    switch (role) {
      case Role.ADMIN:
      case Role.BELISA_EDIT:
      case Role.BELISA_READ:
      case Role.BUHGALTER:
      case Role.CUSTOMER:
      case Role.EXPERT:
      case Role.GKNT_CHAIRMAN:
      case Role.GKNT_DEPARTMENT_CHAIRMAN:
      case Role.GKNT_WORKER:
        break;
      case Role.BUREAU_ASSESSOR:
      case Role.BUREAU_CHAIRMAN:
        this._user.bureaus.forEach(bureau => {
          info.push('ГЭС ' + bureau.council.code);
        });
        break;

      case Role.SECTION_ASSESSOR:
      case Role.SECTION_CHAIRMAN:
        this._user.sections.forEach(section => {
          info.push(this._sectionPipe.transform(section) + ', ГЭС ' + section.council.code);
        });
        break;

    }
    return info;
  }


  addDegree() {
    this._user.personInfo.fullDegrees.push(new FullDegreeDto());
  }

  hasDegree(dt: string): boolean {
    return dt != null;
  }

  selectOrg(org: SelectItem) {
    this._user.org = org.value;
  }

  checkModification(): boolean {
    return isDeepEqual(this._user, this._originalUser);
  }
  getSingDate(): Date {
    if (this._user.personInfo.singDate === undefined) {
      let singDate: Date = new Date(0);
      return singDate;
    }
    let singDate: Date = new Date(this._user.personInfo.singDate);
    return singDate;
  }

  isSingDate(): number{
    if (this._user.personInfo.singDate === undefined) {
      let singDate = 0;
      return singDate;
    }
    return this._user.personInfo.singDate;
  }

  // Методы для lazy loading специальностей
  onSpecialityOpen(index: number) {
    const items = this.getSpecialityItems(index);
    const page = this.specialityPageMap.get(index) || 0;
    const loading = this.specialityLoadingMap.get(index) || false;
    
    // Загружаем первую страницу, если еще не загружена
    if (items.length === 0 || (page === 0 && !loading)) {
      this.specialityPageMap.set(index, 0);
      this.specialityHasMoreMap.set(index, true);
      this.loadSpecialities(true, index).subscribe();
    }
  }

  loadSpecialities(reset: boolean = false, index: number): any {
    const loading = this.specialityLoadingMap.get(index) || false;
    const hasMore = this.specialityHasMoreMap.get(index) !== false;
    
    if (loading || (!reset && !hasMore)) {
      return of([]);
    }

    this.specialityLoadingMap.set(index, true);
    const pageSize = 15;
    const pagination = new Pagination(pageSize);
    
    if (reset) {
      this.specialityPageMap.set(index, 0);
    }
    const currentPage = this.specialityPageMap.get(index) || 0;
    pagination.page = currentPage + 1; // Pagination использует 1-based индексацию
    
    let filter = null;
    const currentSearch = this.specialityCurrentSearchMap.get(index) || '';
    if (currentSearch && currentSearch.trim().length > 0) {
      filter = FilterBuilder.contains('name', currentSearch.trim());
    }

    const request = new SearchPageRequest(pagination, filter, [new SortOrder('name', Direction.ASC)]);
    
    return this._dataService.getCatalogAdminPage<CatalogDto>(Catalog.SPECIALITY, request).pipe(
      switchMap((page) => {
        const items = this.getSpecialityItems(index);
        if (reset) {
          // При reset сохраняем существующие выбранные значения
          const existingIds = new Set(items.map(item => item.id));
          const newItems = page.content.filter(item => !existingIds.has(item.id));
          this.specialityItemsMap.set(index, [...items, ...newItems]);
        } else {
          this.specialityItemsMap.set(index, [...items, ...page.content]);
        }
        this.specialityHasMoreMap.set(index, page.page < page.totalPages);
        this.specialityPageMap.set(index, currentPage + 1);
        this.specialityLoadingMap.set(index, false);
        return of(this.specialityItemsMap.get(index));
      })
    );
  }

  loadMoreSpecialities(index: number) {
    const loading = this.specialityLoadingMap.get(index) || false;
    const hasMore = this.specialityHasMoreMap.get(index) !== false;
    
    if (!loading && hasMore) {
      this.loadSpecialities(false, index).subscribe();
    }
  }
  
  isSpecialityLoading(index: number): boolean {
    return this.specialityLoadingMap.get(index) || false;
  }

  compareSpeciality = (a: CatalogDto, b: CatalogDto): boolean => {
    return a && b ? a.id === b.id : a === b;
  }

  addSpeciality() {
    if (!this._user.personInfo.specialities) {
      this._user.personInfo.specialities = [];
    }
    const newIndex = this._user.personInfo.specialities.length;
    this._user.personInfo.specialities.push(null);
    // Инициализируем данные для нового индекса
    this.specialityItemsMap.set(newIndex, []);
    this.specialityPageMap.set(newIndex, 0);
    this.specialityHasMoreMap.set(newIndex, true);
    this.specialityCurrentSearchMap.set(newIndex, '');
  }

  // Методы для lazy loading специализаций
  onSpecializationOpen(index: number) {
    const items = this.getSpecializationItems(index);
    const page = this.specializationPageMap.get(index) || 0;
    const loading = this.specializationLoadingMap.get(index) || false;
    
    // Загружаем первую страницу, если еще не загружена
    if (items.length === 0 || (page === 0 && !loading)) {
      this.specializationPageMap.set(index, 0);
      this.specializationHasMoreMap.set(index, true);
      this.loadSpecializations(true, index).subscribe();
    }
  }

  loadSpecializations(reset: boolean = false, index: number): any {
    const loading = this.specializationLoadingMap.get(index) || false;
    const hasMore = this.specializationHasMoreMap.get(index) !== false;
    
    if (loading || (!reset && !hasMore)) {
      return of([]);
    }

    this.specializationLoadingMap.set(index, true);
    const pageSize = 15;
    const pagination = new Pagination(pageSize);
    
    if (reset) {
      this.specializationPageMap.set(index, 0);
    }
    const currentPage = this.specializationPageMap.get(index) || 0;
    pagination.page = currentPage + 1; // Pagination использует 1-based индексацию
    
    let filter = null;
    const currentSearch = this.specializationCurrentSearchMap.get(index) || '';
    if (currentSearch && currentSearch.trim().length > 0) {
      filter = FilterBuilder.contains('name', currentSearch.trim());
    }

    const request = new SearchPageRequest(pagination, filter, [new SortOrder('name', Direction.ASC)]);
    
    return this._dataService.getCatalogAdminPage<CatalogDto>(Catalog.SPECIALIZATION, request).pipe(
      switchMap((page) => {
        const items = this.getSpecializationItems(index);
        if (reset) {
          // При reset сохраняем существующие выбранные значения
          const existingIds = new Set(items.map(item => item.id));
          const newItems = page.content.filter(item => !existingIds.has(item.id));
          this.specializationItemsMap.set(index, [...items, ...newItems]);
        } else {
          this.specializationItemsMap.set(index, [...items, ...page.content]);
        }
        this.specializationHasMoreMap.set(index, page.page < page.totalPages);
        this.specializationPageMap.set(index, currentPage + 1);
        this.specializationLoadingMap.set(index, false);
        return of(this.specializationItemsMap.get(index));
      })
    );
  }

  loadMoreSpecializations(index: number) {
    const loading = this.specializationLoadingMap.get(index) || false;
    const hasMore = this.specializationHasMoreMap.get(index) !== false;
    
    if (!loading && hasMore) {
      this.loadSpecializations(false, index).subscribe();
    }
  }
  
  isSpecializationLoading(index: number): boolean {
    return this.specializationLoadingMap.get(index) || false;
  }

  compareSpecialization = (a: CatalogDto, b: CatalogDto): boolean => {
    return a && b ? a.id === b.id : a === b;
  }

  addSpecialization() {
    if (!this._user.personInfo.specializations) {
      this._user.personInfo.specializations = [];
    }
    const newIndex = this._user.personInfo.specializations.length;
    this._user.personInfo.specializations.push(null);
    // Инициализируем данные для нового индекса
    this.specializationItemsMap.set(newIndex, []);
    this.specializationPageMap.set(newIndex, 0);
    this.specializationHasMoreMap.set(newIndex, true);
    this.specializationCurrentSearchMap.set(newIndex, '');
  }

  // Методы для lazy loading областей компетенции
  onAreaOpen(index: number) {
    const items = this.getAreaItems(index);
    const page = this.areaPageMap.get(index) || 0;
    const loading = this.areaLoadingMap.get(index) || false;
    
    // Загружаем первую страницу, если еще не загружена
    if (items.length === 0 || (page === 0 && !loading)) {
      this.areaPageMap.set(index, 0);
      this.areaHasMoreMap.set(index, true);
      this.loadAreas(true, index).subscribe();
    }
  }

  loadAreas(reset: boolean = false, index: number): any {
    const loading = this.areaLoadingMap.get(index) || false;
    const hasMore = this.areaHasMoreMap.get(index) !== false;
    
    if (loading || (!reset && !hasMore)) {
      return of([]);
    }

    this.areaLoadingMap.set(index, true);
    const pageSize = 15;
    const pagination = new Pagination(pageSize);
    
    if (reset) {
      this.areaPageMap.set(index, 0);
    }
    const currentPage = this.areaPageMap.get(index) || 0;
    pagination.page = currentPage + 1; // Pagination использует 1-based индексацию
    
    let filter = null;
    const currentSearch = this.areaCurrentSearchMap.get(index) || '';
    if (currentSearch && currentSearch.trim().length > 0) {
      filter = FilterBuilder.contains('name', currentSearch.trim());
    }

    const request = new SearchPageRequest(pagination, filter, [new SortOrder('name', Direction.ASC)]);
    
    return this._dataService.getCatalogAdminPage<CatalogDto>(Catalog.AREA_OF_COMPETENCE, request).pipe(
      switchMap((page) => {
        const items = this.getAreaItems(index);
        if (reset) {
          // При reset сохраняем существующие выбранные значения
          const existingIds = new Set(items.map(item => item.id));
          const newItems = page.content.filter(item => !existingIds.has(item.id));
          this.areaItemsMap.set(index, [...items, ...newItems]);
        } else {
          this.areaItemsMap.set(index, [...items, ...page.content]);
        }
        this.areaHasMoreMap.set(index, page.page < page.totalPages);
        this.areaPageMap.set(index, currentPage + 1);
        this.areaLoadingMap.set(index, false);
        return of(this.areaItemsMap.get(index));
      })
    );
  }

  loadMoreAreas(index: number) {
    const loading = this.areaLoadingMap.get(index) || false;
    const hasMore = this.areaHasMoreMap.get(index) !== false;
    
    if (!loading && hasMore) {
      this.loadAreas(false, index).subscribe();
    }
  }
  
  isAreaLoading(index: number): boolean {
    return this.areaLoadingMap.get(index) || false;
  }

  compareArea = (a: CatalogDto, b: CatalogDto): boolean => {
    return a && b ? a.id === b.id : a === b;
  }

  addArea() {
    if (!this._user.areas) {
      this._user.areas = [];
    }
    const newIndex = this._user.areas.length;
    this._user.areas.push(null);
    // Инициализируем данные для нового индекса
    this.areaItemsMap.set(newIndex, []);
    this.areaPageMap.set(newIndex, 0);
    this.areaHasMoreMap.set(newIndex, true);
    this.areaCurrentSearchMap.set(newIndex, '');
  }
}
