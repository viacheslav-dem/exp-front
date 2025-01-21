import {Filter} from "app/components/common-components/page-and-filter/model/Filter";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";
import {Pagination} from "@app/components/common-components/page-and-filter/model/Pagination";
import {SortOrder} from "@app/components/common-components/page-and-filter/model/SortOrder";

export class SearchPageRequest {

  group: string;
  filter: Filter<any>;
  paging: PageRequest = new PageRequest();

  constructor(pagination?: Pagination, filter?: Filter<any>, sortOrders?: SortOrder[], group?: string) {
    if (pagination) {
      this.paging = new PageRequest(pagination);
    }
    this.filter = filter;
    this.paging.orders = sortOrders;
    this.group = group;
  }
}
