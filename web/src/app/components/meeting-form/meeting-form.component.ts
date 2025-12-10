import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";
import * as dayjs from 'dayjs';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {PeriodDto} from "@app/dto/PeriodDto";
import {MeetingPostDto} from "@app/dto/MeetingPostDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {MeetingDto} from "@app/dto/MeetingDto";
import {ProjectService} from "@app/services/project.service";
import {MeetingService} from "@app/services/meeting.service";
import {isEmptyOrNull} from "@app/support/utils";

@Component({
  selector: 'app-meeting-form',
  templateUrl: './meeting-form.component.html'
})
export class MeetingFormComponent {

  period = new PeriodDto(dayjs().valueOf(), dayjs().valueOf());
  projects: ProjectPlainDto[] = [];
  id: number;
  place: string;
  isEdit: boolean;
  @ViewChild('modal', { static: false }) modal: ModalDirective;
  @Output() onAdd: EventEmitter<MeetingDto> = new EventEmitter<MeetingDto>();

  constructor(private _meetingService: MeetingService,
              private _projectService: ProjectService,
              private _toasty: GlobalToastyService) {
  }

  loadProjectsForMeeting() {
    this._projectService.getProjectsForMeeting().subscribe(res => this.projects = res);
  }

  save() {
    let endDate = dayjs(this.period.end);
    this.period.end = dayjs(this.period.start).hour(endDate.hour()).minute(endDate.minute()).valueOf();
    this.validateProject();
    this.validateData();
    let meeting = new MeetingPostDto(this.period, this.place, this.projects.filter(project => project.isChecked));
    this._meetingService.createMeeting(meeting).subscribe(res => {
      this._toasty.success("Заседание создано.");
      this.modal.hide();
      this.onAdd.emit(res);

    });
  }

  edit() {
    let endDate = dayjs(this.period.end);
    this.period.end = dayjs(this.period.start).hour(endDate.hour()).minute(endDate.minute()).valueOf();
    this.validateProject();
    this.validateData();
    let meeting = new MeetingPostDto(this.period, this.place, this.projects.filter(project => project.isChecked), this.id);
    this._meetingService.editMeeting(meeting).subscribe(res => {
      this._toasty.success("Заседание перенесено.");
      this.modal.hide();
      this.onAdd.emit(res);
    });
  }


  cancel() {
    this.modal.hide();
  }

  validateProject() {
    if (this.projects.filter(project => project.isChecked).length == 0) {
      throw 'Не выбраны объекты экспертизы.';
    }
  }

  validateData() {
    if (this.period.start >= this.period.end) {
      throw 'Время окончания должно следовать за временем начала.';
    }
    if (isEmptyOrNull(this.place)) {
      throw 'Не указано место проведения заседания.';
    }
  }

  show(meeting: MeetingDto) {
    if (meeting != null) {
      this.id = meeting.id;
      this.period = meeting.period;
      this.place = meeting.place;
      this.isEdit = true;
      this._projectService.getProjectsForMeeting().subscribe(res => {
        this.projects = [];
        for (let agenda of meeting.agendas) {
          agenda.project.isChecked = true;
          this.projects.push(agenda.project);
        }
        this.projects.push(...res);
      });

    }
    else {
      this.period = new PeriodDto(dayjs().valueOf(), dayjs().valueOf());
      this.place = null;
      this.isEdit = false;
      this.loadProjectsForMeeting();
    }
    this.modal.show();
  }
}
