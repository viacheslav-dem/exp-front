import {Component, EventEmitter, OnInit, Output, input} from '@angular/core';
import {Page} from "app/components/common-components/page-and-filter/model/Page";
import {Pagination} from "app/components/common-components/page-and-filter/model/Pagination";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    standalone: false
})
export class PaginationComponent implements OnInit {

  readonly page = input<Page<any>>(undefined);
  readonly pagination = input<Pagination>(undefined);
  readonly previousText = input<string>('Предыдущая');
  readonly nextText = input<string>('Следующая');
  readonly firstText = input<string>('Первая');
  readonly lastText = input<string>('Последняя');
  readonly maxSize = input<number>(10);
  @Output() onPageChanged = new EventEmitter<PageRequest>();

  ngOnInit() {
    const pagination = this.pagination();
    if (pagination) {
      this.pageChanged(pagination);
    }
  }

  get pages(): number[] {
    const page = this.page();
    if (!page || !page.totalPages || page.totalPages < 1) {
      return [];
    }
    const total = page.totalPages;
    const max = this.maxSize() || 10;

    // если страниц меньше или равно maxSize - показываем все
    if (total <= max) {
      const all: number[] = [];
      for (let i = 1; i <= total; i++) {
        all.push(i);
      }
      return all;
    }

    // скользящее окно вокруг текущей страницы
    const pagination = this.pagination();
    const current = pagination && pagination.page ? pagination.page : 1;
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