import {Component, input, ChangeDetectionStrategy, ChangeDetectorRef, output} from "@angular/core";
import {ProjectDto} from "@app/dto/ProjectDto";
import {DatePipe} from "@angular/common";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-expert-reject-project',
    templateUrl: 'expert-reject-project.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})


export class ExpertRejectProject {

  readonly project = input<ProjectDto>(undefined);
  readonly cancel = output<void>();
  readonly confirm = output<string>();
  ExpertRejectionReason = ExpertRejectionReason;
  variants = [ExpertRejectionReason.COMPETENCE, ExpertRejectionReason.TIME, ExpertRejectionReason.OTHER];
  selectReason: string;
  otherReason: string;
  date: Date;

  constructor(private _toasty: GlobalToastyService,
              private _datePipe: DatePipe,
              private cdr: ChangeDetectorRef) {
  }

  onCancel() {
    this.cancel.emit();
    this.cdr?.markForCheck?.();
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
    if (finalReason != null) {
      this.confirm.emit(finalReason);
      this.cdr?.markForCheck?.();
    }
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
