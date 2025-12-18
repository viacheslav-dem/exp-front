import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, input} from '@angular/core';
import {ModalDirective, ModalOptions} from "ngx-bootstrap/modal";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.dialogs)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class ModalComponent implements OnInit, OnDestroy {

  readonly title = input<string>(undefined);
  readonly modalClasses = input<string>('modal-lg');
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  readonly closePermission = input<boolean>(true);
  config: ModalOptions = new ModalOptions();

  @ViewChild('ng2Modal') public modal: ModalDirective;

  constructor() {
    this.config.backdrop = "static";
    this.config.keyboard = false;
  }

  ngOnInit() {
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
  }

  public hide(): void {
    this.modal.hide();
    this.unlockBodyScroll();
  }

  internalHide(): void {
    if (this.closePermission()) {
      this.modal.hide();
    }
    this.unlockBodyScroll();
    this.onClose.emit();
  }

  ngOnDestroy(): void {
    this.unlockBodyScroll();
  }

}
