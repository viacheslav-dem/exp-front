import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, input, output} from '@angular/core';
import {Page} from "app/components/common-components/page-and-filter/model/Page";
import {Pagination} from "app/components/common-components/page-and-filter/model/Pagination";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";
import {isPlatformBrowser} from "@angular/common";
import {fromEvent, Subscription} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['pagination.component.scss'],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.listsAndFilters)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class PaginationComponent implements OnInit, OnDestroy {

  readonly page = input<Page<any>>(undefined);
  readonly pagination = input<Pagination>(undefined);
  readonly previousText = input<string>('Предыдущая');
  readonly nextText = input<string>('Следующая');
  readonly firstText = input<string>('Первая');
  readonly lastText = input<string>('Последняя');
  readonly maxSize = input<number>(10);
  readonly onPageChanged = output<PageRequest>();

  private isMobile = false;
  private resizeSubscription?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const pagination = this.pagination();
    if (pagination) {
      this.pageChanged(pagination);
    }

    // Определяем, является ли устройство мобильным
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobile();
      // Подписываемся на изменения размера окна
      this.resizeSubscription = fromEvent(window, 'resize')
        .pipe(debounceTime(100))
        .subscribe(() => this.checkMobile());
    }
  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  private checkMobile(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Проверяем ширину экрана (breakpoint lg в Bootstrap = 992px)
      const nextIsMobile = window.innerWidth < 992;
      if (nextIsMobile !== this.isMobile) {
        this.isMobile = nextIsMobile;
        // Важно для OnPush/zoneless: событие resize приходит извне, поэтому явно просим обновить шаблон
        this.cdr.markForCheck();
      }
    }
  }

  get pages(): number[] {
    const page = this.page();
    if (!page || !page.totalPages || page.totalPages < 1) {
      return [];
    }
    const total = page.totalPages;
    // Уменьшаем количество страниц на мобильных устройствах
    const baseMaxSize = this.maxSize() || 10;
    // На мобильных - максимум 5, на ПК - уменьшаем на 1 от базового значения
    const max = this.isMobile ? Math.min(baseMaxSize, 5) : Math.max(1, baseMaxSize - 1);

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