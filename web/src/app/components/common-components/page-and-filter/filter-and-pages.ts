import { OnInit, Directive } from "@angular/core";
import {SearchField} from "app/components/common-components/page-and-filter/model/SearchField";
import {Page} from "app/components/common-components/page-and-filter/model/Page";
import {Filter} from "app/components/common-components/page-and-filter/model/Filter";
import {SearchPageRequest} from "app/components/common-components/page-and-filter/model/SearchPageRequest";
import {Pagination} from "app/components/common-components/page-and-filter/model/Pagination";
import {SortOrder} from "app/components/common-components/page-and-filter/model/SortOrder";
import {FilterBuilder} from "app/components/common-components/page-and-filter/model/FilterBuilder";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";

@Directive()
export abstract class FilterAndPages<T> implements OnInit {

  _page: Page<T> = new Page();
  _pagination: Pagination;
  _searchRequest: SearchPageRequest;
  _loading: boolean = false;

  static searchFieldsCache: any = {};

  _searchFields: SearchField[] = [];
  _filters: Filter<any>[] = [];
  _sortOrders: SortOrder[] = [];

  constructor(itemsPerPage?: number) {
    this._pagination = new Pagination(itemsPerPage ? itemsPerPage : 10);
    this._searchRequest = new SearchPageRequest(this._pagination);
  }

  ngOnInit() {
  }

  enableFilterCache(pageName: string) {
    if (FilterAndPages.searchFieldsCache[pageName]) {
      this._searchFields = FilterAndPages.searchFieldsCache[pageName];
    } else {
      FilterAndPages.searchFieldsCache[pageName] = this._searchFields;
    }
  }

  setLoading(loading: boolean) {
    setTimeout(() => this._loading = loading, 0);
  }

  protected getFilters(): Filter<any>[] {
    return this._filters.concat(this._searchFields
      .filter(searchField => !searchField.isEmpty())
      .map(searchField => searchField.getFilter()));
  }

  // for filter
  onFilterChanged() {
    this.setPage(0);
    this.update();
  }

  protected getSortOrders(): SortOrder[] {
    return this._searchFields.map(field => field.sortOrder).filter(order => order).concat(this._sortOrders);
  }

  getSearchField(key: string): any {
    return this._searchFields.find(field => field.key == key);
  }

  private setPage(page: number) {
    // for request
    this._searchRequest.paging.page = page;
    // for pagination component
    this._pagination.page = page + 1;
  }

  // for pagination component
  onPageChanged(pageRequest: PageRequest) {
    this.setPage(pageRequest.page);
    this.update();
  }

  protected prepareRequest() {
    this._searchRequest.paging.orders = this.getSortOrders();
    this._searchRequest.filter = FilterBuilder.and('', this.getFilters());
  }

  update() {
    this.prepareRequest();
    this.setLoading(true);
    this.loadPage();
  }

  protected abstract loadPage();
}
