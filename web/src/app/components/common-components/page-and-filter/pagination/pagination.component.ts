import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Page} from "app/components/common-components/page-and-filter/model/Page";
import {Pagination} from "app/components/common-components/page-and-filter/model/Pagination";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    standalone: false
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

  ngOnInit() {
    if (this.pagination) {
      this.pageChanged(this.pagination);
    }
  }

  get pages(): number[] {
    if (!this.page || !this.page.totalPages || this.page.totalPages < 1) {
      return [];
    }
    const total = this.page.totalPages;
    const max = this.maxSize || 10;

    // если страниц меньше или равно maxSize - показываем все
    if (total <= max) {
      const all: number[] = [];
      for (let i = 1; i <= total; i++) {
        all.push(i);
      }
      return all;
    }

    // скользящее окно вокруг текущей страницы
    const current = this.pagination && this.pagination.page ? this.pagination.page : 1;
    let start = current - Math.floor(max / 2);
    if (start < 1) {
      start = 1;
    }
    let end = start + max - 1;
    if (end > total) {
      end = total;
      start = end - max + 1;
      if (start < 1) {
        start = 1;
      }
    }

    const windowPages: number[] = [];
    for (let i = start; i <= end; i++) {
      windowPages.push(i);
    }
    return windowPages;
  }

  pageChanged(event: Pagination): void {
    this.onPageChanged.emit(new PageRequest(event));
  }
}