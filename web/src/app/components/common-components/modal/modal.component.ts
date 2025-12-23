import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  input,
  inject,
  signal
} from '@angular/core';
import {ModalDirective, ModalOptions} from "ngx-bootstrap/modal";
import {environment} from "../../../../environments/environment";
import {fromEvent} from "rxjs";
import {auditTime, distinctUntilChanged, map} from "rxjs/operators";

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    standalone: false,
    styles: [`
      .modal-content {
        position: relative;
      }

      .modal-back-to-top {
        position: fixed;
        right: 24px;
        bottom: 24px;
        /* Bootstrap modal: 1055 (dialog), backdrop: 1050 */
        z-index: 1060;
        width: 40px;
        height: 40px;
        border-radius: 9999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        opacity: 0.95;
        transition: transform 120ms ease, opacity 120ms ease;
      }

      .modal-back-to-top:hover {
        transform: translateY(-2px);
        opacity: 1;
      }
    `],
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.dialogs)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class ModalComponent implements OnInit, AfterViewInit, OnDestroy {

  readonly title = input<string>(undefined);
  readonly modalClasses = input<string>('modal-lg');
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  readonly closePermission = input<boolean>(true);
  config: ModalOptions = new ModalOptions();

  @ViewChild('ng2Modal') public modal: ModalDirective;
  @ViewChild('modalRoot', { static: true }) public modalRoot?: ElementRef<HTMLElement>;
  @ViewChild('modalBody', { static: true }) public modalBody?: ElementRef<HTMLElement>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly showBackToTop = signal(false);
  private readonly thresholdPx = 240;

  constructor() {
    this.config.backdrop = "static";
    this.config.keyboard = false;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // В ngx-bootstrap scroll обычно происходит на корневом .modal (оверлей),
    // а не на .modal-body, поэтому слушаем modalRoot. Если в будущем появится
    // внутренний scroll у body — fallback сохранён.
    const el = this.modalRoot?.nativeElement ?? this.modalBody?.nativeElement;
    if (!el) {
      return;
    }

    const sub = fromEvent(el, 'scroll').pipe(
      auditTime(100),
      map(() => el.scrollTop > this.thresholdPx),
      distinctUntilChanged(),
    ).subscribe(value => {
      this.showBackToTop.set(value);
      // На случай zoneless/OnPush — явно помечаем.
      this.cdr.markForCheck();
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  scrollModalToTop(smooth: boolean = true): void {
    const el = this.modalRoot?.nativeElement ?? this.modalBody?.nativeElement;
    if (!el) {
      return;
    }
    try {
      el.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    } catch {
      el.scrollTop = 0;
    }
    this.showBackToTop.set(false);
    this.cdr.markForCheck();
  }

  private lockBodyScroll() {
    const body = document.body;
    if (!body) {
      return;
    }
    body.classList.add('modal-open');
    body.style.overflow = 'hidden';
  }

  private unlockBodyScroll() {
    const body = document.body;
    if (!body) {
      return;
    }
    body.classList.remove('modal-open');
    body.style.overflow = '';
    body.style.paddingRight = '';
  }

  public show(): void {
    this.modal.show();
    this.lockBodyScroll();
    // Удобство: открываем модалку всегда сверху.
    setTimeout(() => this.scrollModalToTop(false), 0);
  }

  public hide(): void {
    this.modal.hide();
    this.unlockBodyScroll();
    this.showBackToTop.set(false);
  }

  internalHide(): void {
    if (this.closePermission()) {
      this.modal.hide();
    }
    this.unlockBodyScroll();
    this.showBackToTop.set(false);
    this.onClose.emit();
  }

  ngOnDestroy(): void {
    this.unlockBodyScroll();
  }

}
