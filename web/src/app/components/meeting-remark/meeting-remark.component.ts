import {Component, EventEmitter, Output, input} from "@angular/core";
import {RemarkDto} from "@app/dto/RemarkDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {RemarksContainerDto} from "@app/dto/RemarksContainerDto";
import {Role} from "@app/pipes/role.pipe";

@Component({
    selector: 'app-meeting-remark',
    templateUrl: './meeting-remark.component.html',
    standalone: false
})

export class MeetingRemarkComponent {

  constructor(private _toasty: GlobalToastyService,
              private _dialogService: DialogService) {
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
    let rem = new RemarkDto();
    rem.question = remark.question;
    const role = this.role();
    if (role == Role.SECTION_CHAIRMAN) {
      this.allRemarks().sectionMeetingRemark.push(rem);
    }
    if (role == Role.BUREAU_CHAIRMAN) {
      this.allRemarks().bureauMeetingRemark.push(rem);
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
