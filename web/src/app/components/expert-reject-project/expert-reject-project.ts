import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ProjectDto} from "@app/dto/ProjectDto";
import {DatePipe} from "@angular/common";
import {GlobalToastyService} from "@app/services/global-toasty.service";

@Component({
    selector: 'app-expert-reject-project',
    templateUrl: 'expert-reject-project.html',
    standalone: false
})


export class ExpertRejectProject {

  @Input() project: ProjectDto;
  @Output() cancel = new EventEmitter();
  @Output() confirm = new EventEmitter<string>();
  ExpertRejectionReason = ExpertRejectionReason;
  variants = [ExpertRejectionReason.COMPETENCE, ExpertRejectionReason.TIME, ExpertRejectionReason.OTHER];
  selectReason: string;
  otherReason: string;
  date: Date;

  constructor(private _toasty: GlobalToastyService,
              private _datePipe: DatePipe) {
  }

  onCancel() {
    this.cancel.emit();
  }

  onSave() {
    if (this.selectReason == null) {
      this._toasty.warn('Пожалуйста, укажите причину отказа от проведения государственной экспертизы.');
      return;
    }
    let finalReason;
    switch (this.selectReason) {
      case ExpertRejectionReason.COMPETENCE:
        finalReason = this.selectReason;
        break;
      case ExpertRejectionReason.TIME:
        finalReason = this.createTimeReason();
        break;
      case this.ExpertRejectionReason.OTHER:
        finalReason = this.createOtherReason();
        break;
    }
    if (finalReason != null)
      this.confirm.emit(finalReason);
  }

  createTimeReason(): string {
    if (this.date == null) {
      this._toasty.warn('Пожалуйста, укажите возможные сроки начала проведения государственной экспертизы.');
      return null;
    }
    return this.selectReason + '. Возможный срок начала проведения экспертизы: ' +
      this._datePipe.transform(this.date, 'dd.MM.yyyy');
  }

  createOtherReason(): string {
    if (this.otherReason == null) {
      this._toasty.warn('Пожалуйста, укажите причину отказа от проведения государственной экспертизы.');
      return null;
    }
    return this.selectReason + ': ' + this.otherReason;
  }
}

export enum ExpertRejectionReason {
  COMPETENCE = 'компетенция эксперта не соответствует тематике объекта экспертизы',
  TIME = 'отсутствует временной ресурс для проведения экспертизы',
  OTHER = 'иные причины'
}
