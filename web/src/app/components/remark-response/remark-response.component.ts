import {ChangeDetectionStrategy, Component, EventEmitter, Output, input} from "@angular/core";
import {RemarkDto} from "@app/dto/RemarkDto";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-remark-response',
    templateUrl: './remark-response.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})

export class RemarkResponseComponent {

  readonly remarks = input<RemarkDto[]>([]);
  readonly isEdit = input<boolean>(false);
  readonly isExpired = input<boolean>(false);
  @Output() onSave: EventEmitter<RemarkDto[]> = new EventEmitter<RemarkDto[]>();
  @Output() onReply: EventEmitter<RemarkDto[]> = new EventEmitter<RemarkDto[]>();

  save() {
    this.onSave.emit(this.remarks());
  }

  reply() {
    this.onReply.emit(this.remarks());
  }

}
