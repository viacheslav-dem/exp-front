import {Component, EventEmitter, Input, Output} from "@angular/core";
import {RemarkDto} from "@app/dto/RemarkDto";

@Component({
  selector: 'app-remark-response',
  templateUrl: './remark-response.component.html'
})

export class RemarkResponseComponent {

  @Input() remarks: RemarkDto[] = [];
  @Input() isEdit: boolean = false;
  @Input() isExpired: boolean = false;
  @Output() onSave: EventEmitter<RemarkDto[]> = new EventEmitter<RemarkDto[]>();
  @Output() onReply: EventEmitter<RemarkDto[]> = new EventEmitter<RemarkDto[]>();

  save() {
    this.onSave.emit(this.remarks);
  }

  reply() {
    this.onReply.emit(this.remarks);
  }

}
