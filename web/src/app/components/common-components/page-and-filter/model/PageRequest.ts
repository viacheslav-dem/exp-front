/**
 * Created by Ilya on 12.07.2017.
 */
import {SortOrder} from "app/components/common-components/page-and-filter/model/SortOrder";
import {Pagination} from "app/components/common-components/page-and-filter/model/Pagination";

export class PageRequest {

  page: number = 0;
  size: number = 10;
  orders: SortOrder[] = [];

  constructor(pagination?: Pagination) {
    if (pagination) {
      this.setPaginationParams(pagination);
    }
  }

  static forPage(page: number, itemsPerPage?: number) {
    let pageRequest = new PageRequest();
    pageRequest.page = page;
    if (itemsPerPage) {
      pageRequest.size = itemsPerPage;
    }
    return pageRequest;
  }

  setPaginationParams(pagination: Pagination) {
    this.page = pagination.page - 1;
    this.size = pagination.itemsPerPage;
  }
}
