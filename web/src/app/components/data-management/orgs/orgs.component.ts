import {ChangeDetectionStrategy, ChangeDetectorRef, Component, viewChild} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {timer} from 'rxjs';
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {DataService} from "@app/services/data.service";
import {OrgDto} from "@app/dto/OrgDto";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {SearchPersonComponent} from "@app/components/search/search-person/search-person.component";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {SearchOrgComponent} from "@app/components/search/search-org/search-org.component";
import {createTrackKeyStore} from "@app/support/utils";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-orgs',
    templateUrl: './orgs.component.html',
    styleUrls: ['./orgs.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.dataManagement) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class OrgsComponent extends FilterAndPages<OrgDto> {

  orgs: OrgDto[];
  subOrgs: OrgDto[] = [];
  selectedOrg: OrgDto;
  editedOrg: OrgDto;

  private readonly _trackKey = createTrackKeyStore<object>('orgs:');

  trackOrg(org: OrgDto): number | string {
    return org.id || this._trackKey(org);
  }

  public readonly searchPersonModal = viewChild(SearchPersonComponent);
  public readonly searchOrgModal = viewChild(SearchOrgComponent);
  readonly showSubOrgModal = viewChild<ModalComponent>('showSubOrgModal');

  constructor(private _toasty: GlobalToastyService,
              private _dataService: DataService,
              private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this._searchFields = [
      SearchField.contains('name').setPlaceholder('Поиск по наименованию...')
        .setSortDirection(Direction.ASC).setSortable(true),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
    this.enableFilterCache("orgs");
    // Если нет сохранённого состояния фильтров, загружаем данные явно
    timer(100).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const hasCachedFilters = localStorage.getItem('filter_cache_orgs');
      if (!hasCachedFilters) {
        this.update();
      }
    });
  }

  loadPage() {
    this._dataService.getOrgsAdminPage(this._searchRequest).subscribe(res => {
      this.setLoading(false);
      this._page = res;
      this.orgs = this._page.content;
      this.cdr?.markForCheck?.();
    }, () => {
      this.setLoading(false);
      this.cdr?.markForCheck?.();
    });
  }

  editOrg(org: OrgDto) {
    if (this.selectedOrg) {
      this.selectedOrg.isEdit = false;
    }
    this.selectedOrg = org;
    this.editedOrg = (this.selectedOrg.id == 0 ?
      this.selectedOrg : OrgsComponent.copyOrg(this.selectedOrg));
    this.selectedOrg.isEdit = this.selectedOrg.isExpanded = true;
  }

  cancelEditOrg() {
    this.selectedOrg.isEdit = false;
  }

  saveEditedOrg() {
    if (this.editedOrg.parentOrg != null) {
      if (this.editedOrg.id == this.editedOrg.parentOrg.id) {
        this._toasty.error('Невозможно указать свою организацию головной.');
        return;
      }
    }
    this._dataService.saveOrg(this.editedOrg).subscribe(res => {
      this._toasty.success("Сохранено.");
      this.update();
      this.searchOrgModal()?.update();
      this.cdr?.markForCheck?.();
    });
  }

  addOrg() {
    let newOrg = new OrgDto();
    this.orgs.unshift(newOrg);
    this.editOrg(newOrg);
    this.cdr?.markForCheck?.();
  }

  deleteOrg(orgInd) {
    this.orgs.splice(orgInd, 1);
    this.cdr?.markForCheck?.();
  }

  showPersonModal() {
    this.searchPersonModal()?.show();
  }

  showOrgModal() {
    this.searchOrgModal()?.show();
  }

  selectPerson(person: PersonPlainDto) {
    this.editedOrg.chairman = person;
    this.searchPersonModal()?.hide();
    this.cdr?.markForCheck?.();
  }

  selectOrg(org: OrgDto) {
    this.editedOrg.parentOrg = org;
    this.searchOrgModal()?.hide();
    this.cdr?.markForCheck?.();
  }

  deleteParentOrg() {
    this.editedOrg.parentOrg = null;
  }

  static copyOrg(org: OrgDto) {
    return Object.assign({}, org);
  }

  showChildOrgs(orgs: OrgDto[]) {
    this.subOrgs = orgs;
    this.showSubOrgModal()?.show();
  }
}
