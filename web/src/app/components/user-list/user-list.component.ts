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
      table {
          font-size: 0.875rem;
          background-color: white;
          margin-bottom: 0;
      }

      td, th {
          padding: 0.75rem 0.5rem;
      }
  `]
})
export class UserListComponent extends FilterAndPages<PersonDto> implements OnDestroy {

  SortClass = SortClass;
  @ViewChild('showUserInfo') showUserInfo: ModalComponent;
  users: PersonDto[] = [];
  selectedUser: PersonDto;
  sortOrder: SortOrder = new SortOrder('person', Direction.ASC);
  onPersonListChangedSubscription: Subscription;

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

}
