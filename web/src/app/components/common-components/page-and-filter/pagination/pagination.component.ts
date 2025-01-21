import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Page} from "app/components/common-components/page-and-filter/model/Page";
import {Pagination} from "app/components/common-components/page-and-filter/model/Pagination";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit {

  @Input() page: Page<any>;
  @Input() pagination: Pagination;
  @Input() previousText: string = 'Предыдущая';
  @Input() nextText: string = 'Следующая';
  @Input() firstText: string = 'Первая';
  @Input() lastText: string = 'Последняя';
  @Input() maxSize: number = 10;
  @Output() onPageChanged = new EventEmitter<PageRequest>();

  constructor() {
    this.pagination = new Pagination();
  }

  ngOnInit() {
    this.pageChanged(this.pagination);
  }

  pageChanged(event: Pagination): void {
    this.onPageChanged.emit(new PageRequest(event));
  }
}
