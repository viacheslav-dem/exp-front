import {Component, OnDestroy, ViewChild} from '@angular/core';
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
import {Subscription} from "rxjs";
import {AcademicTitleTypePipe, getAllAcademicTitleTypes} from "@app/pipes/academic-title.pipe";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {LastSignEnumPipe} from "@app/pipes/last-sign.pipe";

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styles: [`
      .table-wrapper {
          overflow-x: visible;
          overflow-y: visible;
      }

      .table-responsive {
          overflow-x: visible !important;
      }

      table {
          font-size: 0.9375rem;
          background-color: white;
          margin-bottom: 0;
          table-layout: auto;
          width: 100%;
      }

      thead th {
          padding: 1rem 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.8125rem;
          border-bottom: 2px solid #dee2e6;
          white-space: nowrap;
      }

      tbody td, tbody th {
          padding: 1rem 0.75rem;
          vertical-align: middle;
          border-bottom: 1px solid #f0f0f0;
      }

      .user-name-cell {
          max-width: 250px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }

      .user-email-cell {
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }

      .user-table-row {
          transition: all 0.2s ease;
      }

      .user-table-row:hover {
          background-color: #f8f9fa !important;
          transform: scale(1.01);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .user-table-row.alert-danger {
          background-color: #f8d7da;
          border-left: 3px solid #dc3545;
      }

      .user-table-row.alert-danger:hover {
          background-color: #f1aeb5 !important;
      }

      .user-table-row.alert-dark {
          background-color: #d1d3d4;
      }

      .user-table-row.alert-deleted {
          text-decoration: line-through;
          opacity: 0.6;
      }

      .cursor-pointer {
          cursor: pointer;
      }

      .cursor-pointer:hover {
          color: #0d6efd !important;
      }

      .badge {
          font-size: 0.7rem;
          padding: 0.35rem 0.65rem;
      }

      .btn-link {
          text-decoration: none;
          transition: all 0.2s ease;
      }

      .btn-link:hover {
          transform: scale(1.2);
      }

      .btn-link.text-primary:hover {
          color: #0b5ed7 !important;
      }

      .btn-link.text-danger:hover {
          color: #bb2d3b !important;
      }

      @media (max-width: 991.98px) {
          table {
              font-size: 0.8rem;
          }
          
          thead th, tbody td, tbody th {
              padding: 0.75rem 0.5rem;
          }
      }

      // Mobile card styles
      .user-card {
          transition: all 0.2s ease;
      }

      .user-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
      }

      .user-card.alert-danger {
          background-color: #f8d7da;
          border-left: 3px solid #dc3545 !important;
      }

      .user-card.alert-dark {
          background-color: #d1d3d4;
      }

      .user-card.alert-deleted {
          text-decoration: line-through;
          opacity: 0.6;
      }

      .user-card-name {
          font-size: 0.9375rem;
          word-break: break-word;
      }

      .user-card-email {
          word-break: break-all;
      }

      .btn-group-sm .btn {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
      }

      // Mobile filter collapse animation
      .collapse {
          transition: height 0.35s ease;
      }

      .collapse.show {
          display: block !important;
      }

      .filter-toggle-btn {
          color: #212529;
          transition: color 0.2s ease;
          border: none;
          background: transparent;
      }

      .filter-toggle-btn:hover {
          color: #0d6efd !important;
          background: transparent !important;
          transform: none !important;
      }

      .filter-toggle-btn:focus {
          box-shadow: none;
          outline: none;
      }

      .filter-toggle-btn:active {
          transform: none !important;
      }

      .filter-chevron {
          transition: transform 0.3s ease;
          font-size: 0.875rem;
          color: inherit;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 1.25rem;
          flex-shrink: 0;
      }

      .filter-toggle-btn:hover .filter-chevron {
          transform: none;
          color: inherit;
      }

      .filter-toggle-btn .filter-chevron svg {
          width: 0.875rem;
          height: 0.875rem;
      }
  `],
    standalone: false
})
export class UserListComponent extends FilterAndPages<PersonDto> implements OnDestroy {

  SortClass = SortClass;
  @ViewChild('showUserInfo', { static: false }) showUserInfo: ModalComponent;
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
              private _degreeTypePipe: DegreeTypePipe) {
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
    this._dataService.getCatalog(Catalog.AREA_OF_COMPETENCE).subscribe((areas: IdNameDto[]) => {
      this.getSearchField('areas').setItems(areas);
    });
    this._dataService.getCatalog(Catalog.SPECIALITY).subscribe((speciality: IdNameDto[]) => {
      this.getSearchField('personInfo.specialities').setItems(speciality);
    });
    this._dataService.getCatalog(Catalog.SPECIALIZATION).subscribe((specialization: IdNameDto[]) => {
      this.getSearchField('personInfo.specializations').setItems(specialization);
    });
    this._dataService.getCatalog(Catalog.SCIENCE_AREA).subscribe((scienceArea: IdNameDto[]) => {
      this.getSearchField('personInfo.fullDegrees.scienceArea').setItems(scienceArea);
    });
    this._dataService.getOrgs().subscribe(orgs => {
      this.getSearchField('org').setItems(orgs);
    });
    this.onPersonListChangedSubscription = this._personService.onPersonListChanged.subscribe(() => this.update());
    this.enableFilterCache("users");
  }

  ngOnDestroy(): void {
    if (this.onPersonListChangedSubscription) {
      this.onPersonListChangedSubscription.unsubscribe();
    }
  }

  loadPage() {
    this._personService.getPersons(this._searchRequest).subscribe(res => {
      this._page = res;
      this.users = res.content;
      this.setLoading(false);
    }, () => this.setLoading(false));
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
    this.showUserInfo.show();
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
  }

}
