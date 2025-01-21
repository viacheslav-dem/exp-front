import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {ModalDirective, ModalOptions} from "ngx-bootstrap";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit {

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

  public show(): void {
    this.modal.show();
  }

  public hide(): void {
    this.modal.hide();
  }

  internalHide(): void {
    if (this.closePermission) {
      this.modal.hide();
    }
    this.onClose.emit();
  }

}
