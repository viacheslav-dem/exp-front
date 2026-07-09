import {ChangeDetectionStrategy, ChangeDetectorRef, Component, output, viewChild} from "@angular/core";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {OrgDto} from "@app/dto/OrgDto";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {DataService} from "@app/services/data.service";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-search-org',
    templateUrl: 'search-org.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.search) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Eager
})

export class SearchOrgComponent extends FilterAndPages<OrgDto> {

  readonly searchOrgModal = viewChild<ModalComponent>('searchOrgModal');
  readonly selected = output<OrgDto>();

  constructor(protected _service: DataService, private cdr: ChangeDetectorRef) {
    super();
    this._searchFields = [SearchField.startsWith('name')
      .setPlaceholder('Поиск по названию').setSortable(true).setSortDirection(Direction.ASC)];
     this._filters = [FilterBuilder.isNull("parentOrg")];
  }

  loadPage() {
    this._service.getOrgsAdminPage(this._searchRequest).subscribe(res => {
      this._page = res;
      this.setLoading(false);
      this.cdr?.markForCheck?.();
    }, () => {
      this.setLoading(false);
      this.cdr?.markForCheck?.();
    });
  }

  onSelected(org) {
    this.selected.emit(org);
  }


  show() {
    this.searchOrgModal()?.show();
    this.cdr?.markForCheck?.();
  }

  hide() {
    this.searchOrgModal()?.hide();
    this.cdr?.markForCheck?.();
  }

}