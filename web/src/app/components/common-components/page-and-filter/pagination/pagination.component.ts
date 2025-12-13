import {Component, EventEmitter, OnInit, Output, input} from '@angular/core';
import {Page} from "app/components/common-components/page-and-filter/model/Page";
import {Pagination} from "app/components/common-components/page-and-filter/model/Pagination";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styles: [`
      .pagination-modern {
        gap: 0.1rem;
        flex-wrap: nowrap;
        font-size: 0.875rem;
      }
      
      @media (min-width: 576px) {
        .pagination-modern {
          gap: 0.15rem;
        }
      }
      
      .pagination-modern .page-link {
        border-radius: 0.375rem;
        border: 1px solid #dee2e6;
        padding: 0.25rem 0.375rem;
        color: #495057;
        background-color: #fff;
        transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        font-weight: 500;
        min-width: 1.75rem;
        text-align: center;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8125rem;
        line-height: 1.2;
        text-decoration: none !important;
        overflow: hidden;
      }
      
      @media (min-width: 576px) {
        .pagination-modern .page-link {
          padding: 0.375rem 0.5rem;
          min-width: 2rem;
          font-size: 0.875rem;
        }
      }
      
      .pagination-modern .page-link-nav {
        min-width: auto;
        padding: 0.25rem 0.375rem;
      }
      
      @media (min-width: 576px) {
        .pagination-modern .page-link-nav {
          min-width: auto;
          padding: 0.375rem 0.5rem;
        }
      }
      
      @media (min-width: 768px) {
        .pagination-modern .page-link-nav {
          min-width: 3.5rem;
          padding: 0.375rem 0.75rem;
        }
      }
      
      .pagination-modern .page-link i {
        font-size: 0.8125rem;
      }
      
      @media (min-width: 576px) {
        .pagination-modern .page-link i {
          font-size: 0.875rem;
        }
      }
      
      .pagination-modern .page-link:hover:not(.disabled):not(.active) {
        background-color: #e9ecef;
        border-color: #0d6efd;
        color: #0d6efd;
        text-decoration: none !important;
      }
      
      .pagination-modern .page-item.active .page-link {
        background-color: #0d6efd;
        border-color: #0d6efd;
        color: #fff;
        font-weight: 600;
        text-decoration: none !important;
      }
      
      .pagination-modern .page-item.active .page-link:hover {
        background-color: #0b5ed7;
        border-color: #0b5ed7;
      }
      
      .pagination-modern .page-item.disabled .page-link {
        background-color: #f8f9fa;
        border-color: #dee2e6;
        color: #6c757d;
        cursor: not-allowed;
        opacity: 0.6;
        text-decoration: none !important;
      }
      
      .pagination-modern .page-item.disabled .page-link:hover {
        background-color: #f8f9fa;
        border-color: #dee2e6;
        color: #6c757d;
      }
      
      .pagination-modern .page-link.rounded-start {
        border-top-left-radius: 0.375rem !important;
        border-bottom-left-radius: 0.375rem !important;
      }
      
      .pagination-modern .page-link.rounded-end {
        border-top-right-radius: 0.375rem !important;
        border-bottom-right-radius: 0.375rem !important;
      }
    `],
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