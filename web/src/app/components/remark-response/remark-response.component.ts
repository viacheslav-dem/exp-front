import {ChangeDetectionStrategy, Component, input, output} from "@angular/core";
import {RemarkDto} from "@app/dto/RemarkDto";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-remark-response',
    templateUrl: './remark-response.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Eager
})

export class RemarkResponseComponent {

  readonly remarks = input<RemarkDto[]>([]);
  readonly isEdit = input<boolean>(false);
  readonly isExpired = input<boolean>(false);
  readonly onSave = output<RemarkDto[]>();
  readonly onReply = output<RemarkDto[]>();

  save() {
    this.onSave.emit(this.remarks());
  }

  reply() {
    this.onReply.emit(this.remarks());
  }

}
