import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import {Subject, of} from "rxjs";
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
export class UserFormComponent implements OnInit {

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
  allAreasOfCompetence: any[] = [];
  allSpecialities: any[] = [];
  allSpecializations: any[] = [];
  allScienceArea: any[] = [];
  allOrgs: SelectItem[] = [];

  // Lazy loading для специальностей
  specialityItems: CatalogDto[] = [];
  specialityLoading: boolean = false;
  specialitySearchInput$ = new Subject<string>();
  specialityPage: number = 0;
  specialityHasMore: boolean = true;
  specialityCurrentSearch: string = '';

  // Lazy loading для специализаций
  specializationItems: CatalogDto[] = [];
  specializationLoading: boolean = false;
  specializationSearchInput$ = new Subject<string>();
  specializationPage: number = 0;
  specializationHasMore: boolean = true;
  specializationCurrentSearch: string = '';

  // Lazy loading для областей компетенции
  areaItems: CatalogDto[] = [];
  areaLoading: boolean = false;
  areaSearchInput$ = new Subject<string>();
  areaPage: number = 0;
  areaHasMore: boolean = true;
  areaCurrentSearch: string = '';


  @Output() onSave = new EventEmitter<PersonDto>();
  @Output() canceled = new EventEmitter();

  constructor(private _dataService: DataService,
              private toasty: GlobalToastyService,
              private _authService: AuthService,
              private _rolePipe: RolePipe,
              private _personService: PersonService,
              private _dialogService: DialogService,
              private _sectionPipe: SectionPipe) {
    // Подписка на поиск специальностей
    this.specialitySearchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm: string) => {
          this.specialityCurrentSearch = searchTerm || '';
          this.specialityPage = 0;
          this.specialityItems = [];
          this.specialityHasMore = true;
          return this.loadSpecialities(true);
        })
      )
      .subscribe();

    // Подписка на поиск специализаций
    this.specializationSearchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm: string) => {
          this.specializationCurrentSearch = searchTerm || '';
          this.specializationPage = 0;
          this.specializationItems = [];
          this.specializationHasMore = true;
          return this.loadSpecializations(true);
        })
      )
      .subscribe();

    // Подписка на поиск областей компетенции
    this.areaSearchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm: string) => {
          this.areaCurrentSearch = searchTerm || '';
          this.areaPage = 0;
          this.areaItems = [];
          this.areaHasMore = true;
          return this.loadAreas(true);
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.allRoles = this._rolePipe.getAllNotAutoActivatedRoles();
    this.role = this._authService.getCurrRole();
    // Убрали загрузку всех областей компетенции, специальностей и специализаций - теперь lazy loading
    this._dataService.getCatalog(Catalog.SCIENCE_AREA).subscribe(res => this.allScienceArea = res);
    this._dataService.getOrgs().subscribe(res => {
      this.allOrgs = res.map((item, ind) => new SelectItem(item, item.name, item.id));
    });
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
  };

  isExpert() {
    return this.hasRole(Role.EXPERT);
  }
  isAdmin() {
    return this._user.roles.find(r => r == this.Role.ADMIN)
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

  getPhoto(person: IdDto) {
    if (person.id != 0){
      this._personService.getPhoto(person).subscribe(
        (res) => {
          if (res.name != null) {
            this.photo = "data:image/png;base64," + res.name;
          } else{
            this.photo = 'assets/abstract_profile.jpg';
          }
        },
        () => this.photo = 'assets/abstract_profile.jpg');
    }
    else
      this.photo = 'assets/abstract_profile.jpg';
  }

  getInfoForRole(role: Role): string[] {
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
    return dt != null
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
  onSpecialityOpen() {
    if (this.specialityItems.length === 0) {
      this.loadSpecialities(true).subscribe();
    }
  }

  loadSpecialities(reset: boolean = false): any {
    if (this.specialityLoading || (!reset && !this.specialityHasMore)) {
      return of([]);
    }

    this.specialityLoading = true;
    const pageSize = 15;
    const pagination = new Pagination(pageSize);
    pagination.page = this.specialityPage + 1; // Pagination использует 1-based индексацию
    
    let filter = null;
    if (this.specialityCurrentSearch && this.specialityCurrentSearch.trim().length > 0) {
      filter = FilterBuilder.contains('name', this.specialityCurrentSearch.trim());
    }

    const request = new SearchPageRequest(pagination, filter, [new SortOrder('name', Direction.ASC)]);
    
    return this._dataService.getCatalogAdminPage<CatalogDto>(Catalog.SPECIALITY, request).pipe(
      switchMap((page) => {
        if (reset) {
          this.specialityItems = page.content;
        } else {
          this.specialityItems = [...this.specialityItems, ...page.content];
        }
        this.specialityHasMore = page.page < page.totalPages - 1;
        this.specialityPage++;
        this.specialityLoading = false;
        return of(this.specialityItems);
      })
    );
  }

  loadMoreSpecialities() {
    if (!this.specialityLoading && this.specialityHasMore) {
      this.loadSpecialities(false).subscribe();
    }
  }

  compareSpeciality = (a: CatalogDto, b: CatalogDto): boolean => {
    return a && b ? a.id === b.id : a === b;
  }

  addSpeciality() {
    if (!this._user.personInfo.specialities) {
      this._user.personInfo.specialities = [];
    }
    this._user.personInfo.specialities.push(null);
  }

  // Методы для lazy loading специализаций
  onSpecializationOpen() {
    if (this.specializationItems.length === 0) {
      this.loadSpecializations(true).subscribe();
    }
  }

  loadSpecializations(reset: boolean = false): any {
    if (this.specializationLoading || (!reset && !this.specializationHasMore)) {
      return of([]);
    }

    this.specializationLoading = true;
    const pageSize = 15;
    const pagination = new Pagination(pageSize);
    pagination.page = this.specializationPage + 1; // Pagination использует 1-based индексацию
    
    let filter = null;
    if (this.specializationCurrentSearch && this.specializationCurrentSearch.trim().length > 0) {
      filter = FilterBuilder.contains('name', this.specializationCurrentSearch.trim());
    }

    const request = new SearchPageRequest(pagination, filter, [new SortOrder('name', Direction.ASC)]);
    
    return this._dataService.getCatalogAdminPage<CatalogDto>(Catalog.SPECIALIZATION, request).pipe(
      switchMap((page) => {
        if (reset) {
          this.specializationItems = page.content;
        } else {
          this.specializationItems = [...this.specializationItems, ...page.content];
        }
        this.specializationHasMore = page.page < page.totalPages - 1;
        this.specializationPage++;
        this.specializationLoading = false;
        return of(this.specializationItems);
      })
    );
  }

  loadMoreSpecializations() {
    if (!this.specializationLoading && this.specializationHasMore) {
      this.loadSpecializations(false).subscribe();
    }
  }

  compareSpecialization = (a: CatalogDto, b: CatalogDto): boolean => {
    return a && b ? a.id === b.id : a === b;
  }

  addSpecialization() {
    if (!this._user.personInfo.specializations) {
      this._user.personInfo.specializations = [];
    }
    this._user.personInfo.specializations.push(null);
  }

  // Методы для lazy loading областей компетенции
  onAreaOpen() {
    if (this.areaItems.length === 0) {
      this.loadAreas(true).subscribe();
    }
  }

  loadAreas(reset: boolean = false): any {
    if (this.areaLoading || (!reset && !this.areaHasMore)) {
      return of([]);
    }

    this.areaLoading = true;
    const pageSize = 15;
    const pagination = new Pagination(pageSize);
    pagination.page = this.areaPage + 1; // Pagination использует 1-based индексацию
    
    let filter = null;
    if (this.areaCurrentSearch && this.areaCurrentSearch.trim().length > 0) {
      filter = FilterBuilder.contains('name', this.areaCurrentSearch.trim());
    }

    const request = new SearchPageRequest(pagination, filter, [new SortOrder('name', Direction.ASC)]);
    
    return this._dataService.getCatalogAdminPage<CatalogDto>(Catalog.AREA_OF_COMPETENCE, request).pipe(
      switchMap((page) => {
        if (reset) {
          this.areaItems = page.content;
        } else {
          this.areaItems = [...this.areaItems, ...page.content];
        }
        this.areaHasMore = page.page < page.totalPages - 1;
        this.areaPage++;
        this.areaLoading = false;
        return of(this.areaItems);
      })
    );
  }

  loadMoreAreas() {
    if (!this.areaLoading && this.areaHasMore) {
      this.loadAreas(false).subscribe();
    }
  }

  compareArea = (a: CatalogDto, b: CatalogDto): boolean => {
    return a && b ? a.id === b.id : a === b;
  }

  addArea() {
    if (!this._user.areas) {
      this._user.areas = [];
    }
    this._user.areas.push(null);
  }
}
