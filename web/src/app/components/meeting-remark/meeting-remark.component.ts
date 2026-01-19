import {Component, EventEmitter, Output, input, ChangeDetectionStrategy} from "@angular/core";
import {RemarkDto} from "@app/dto/RemarkDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {RemarksContainerDto} from "@app/dto/RemarksContainerDto";
import {Role} from "@app/pipes/role.pipe";
import {createTrackKeyStore} from "@app/support/utils";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-meeting-remark',
    templateUrl: './meeting-remark.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.meetings)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})

export class MeetingRemarkComponent {

  constructor(private _toasty: GlobalToastyService,
              private _dialogService: DialogService) {
  }

  private readonly _trackKey = createTrackKeyStore<object>('meeting-remark:');

  trackRemark(remark: RemarkDto): number | string {
    return remark.id || this._trackKey(remark);
  }

  readonly allRemarks = input<RemarksContainerDto>(undefined);
  readonly role = input<Role>(undefined);
  Role = Role;
  newRemark: RemarkDto = new RemarkDto();
  isEdit: boolean = false;
  indexForEdit: number;
  remarkForEdit: RemarkDto = new RemarkDto();
  @Output() onSave = new EventEmitter<RemarksContainerDto>();

  addRemark(remark: RemarkDto) {
    if (remark.question == null || remark.question.length < 1) {
      throw 'Поле замечание не может быть пустым'
    }
    const role = this.role();
    const remarks = this.allRemarks();
    
    // Проверяем, не добавлено ли уже это замечание
    let targetArray: RemarkDto[] = [];
    if (role == Role.SECTION_CHAIRMAN) {
      targetArray = remarks.sectionMeetingRemark;
    }
    if (role == Role.BUREAU_CHAIRMAN) {
      targetArray = remarks.bureauMeetingRemark;
    }
    
    // Проверяем по тексту вопроса, чтобы избежать дубликатов
    const alreadyExists = targetArray.some(r => r.question === remark.question);
    if (alreadyExists) {
      this._toasty.warn('Это замечание уже добавлено');
      return;
    }
    
    let rem = new RemarkDto();
    rem.question = remark.question;
    if (role == Role.SECTION_CHAIRMAN) {
      remarks.sectionMeetingRemark.push(rem);
    }
    if (role == Role.BUREAU_CHAIRMAN) {
      remarks.bureauMeetingRemark.push(rem);
    }
    this.newRemark = new RemarkDto();
  }

  deleteSectionRemark(remark: RemarkDto) {
    this.allRemarks().sectionMeetingRemark = this.allRemarks().sectionMeetingRemark.filter(value => value != remark);
  }

  deleteBureauRemark(remark: RemarkDto) {
    this.allRemarks().bureauMeetingRemark = this.allRemarks().bureauMeetingRemark.filter(value => value != remark);
  }

  editRemark(remark: RemarkDto, index: number) {
    this.indexForEdit = index;
    this.remarkForEdit = remark;
    this.isEdit = true;
  }

  confirmEditRemark(newRemark: RemarkDto) {
    if (newRemark.question == null || newRemark.question.length < 1) {
      throw 'Поле замечание не может быть пустым'
    }
    this.isEdit = false;
    this.indexForEdit = null;
  }

  save() {
    this.onSave.emit(this.allRemarks());
  }
}
