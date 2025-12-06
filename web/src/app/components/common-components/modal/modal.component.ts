import {Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ModalDirective, ModalOptions} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() title: string;
  @Input() modalClasses: string = 'modal-lg';
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Input() closePermission: boolean = true;
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
    if (this.closePermission) {
      this.modal.hide();
    }
    this.unlockBodyScroll();
    this.onClose.emit();
  }

  ngOnDestroy(): void {
    this.unlockBodyScroll();
  }

}
