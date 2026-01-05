import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, signal } from '@angular/core';
import { fromEvent } from 'rxjs';
import { auditTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-back-to-top',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <button
        type="button"
        class="btn btn-primary back-to-top-btn shadow"
        aria-label="Наверх"
        (click)="scrollToTop()"
      >
        <fa-icon icon="angle-up"></fa-icon>
      </button>
    }
  `,
  styles: [`
    .back-to-top-btn {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 1040; /* выше контента/меню, ниже модалок Bootstrap */
      width: 44px;
      height: 44px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      opacity: 0.95;
      transition: transform 120ms ease, opacity 120ms ease;
    }
    .back-to-top-btn:hover {
      transform: translateY(-2px);
      opacity: 1;
    }
  `]
})
export class BackToTopComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly visible = signal(false);

  private readonly thresholdPx = 240;

  constructor() {
    // Важно: рассчитываем scrollTop надёжно (window.scrollY не везде стабилен при старых режимах).
    const getScrollTop = () =>
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const sub = fromEvent(window, 'scroll').pipe(
      auditTime(100),
      startWith(null),
      map(() => getScrollTop() > this.thresholdPx),
      distinctUntilChanged(),
    ).subscribe(value => {
      this.visible.set(value);
      // На случай zoneless / OnPush — явно помечаем для проверки.
      this.cdr.markForCheck();
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  scrollToTop(): void {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // Fallback для окружений без smooth-scroll.
      window.scrollTo(0, 0);
    }
  }
}


