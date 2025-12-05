import {Component, ViewChild} from '@angular/core';
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {AuthService} from "@app/services/auth.service";
import {Role} from "@app/pipes/role.pipe";
import {getAllMeetingStates, MeetingStateBadge, MeetingStatePipe} from "@app/pipes/meeting-state.pipe";
import {MeetingFormComponent} from "@app/components/meeting-form/meeting-form.component";
import {MeetingDto} from "@app/dto/MeetingDto";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {MeetingService} from "@app/services/meeting.service";
import {anyMatch} from "@app/support/utils";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";

@Component({
  selector: 'app-meeting-list',
  templateUrl: 'meeting-list.component.html'
})
export class MeetingListComponent extends FilterAndPages<MeetingDto> {

  MeetingStateBadge = MeetingStateBadge;
  Role = Role; // for template, don't remove!

  role: string;
  meetings: MeetingDto[] = [];

  @ViewChild(MeetingFormComponent, { static: false }) createMeetingModal: MeetingFormComponent;

  constructor(private _toasty: GlobalToastyService,
              private _authService: AuthService,
              private _meetingService: MeetingService,
              private _meetingStatePipe: MeetingStatePipe) {
    super();
  }

  ngOnInit() {
    this.role = this._authService.getCurrRole();
    this._searchFields = [
      SearchField.multiSelect('state', getAllMeetingStates(), value => this._meetingStatePipe.transform(value))
        .setSelectText('Выбор состояния').setCheckAllEnabled(true)
        .setTitle('Состояние заседания').setSortable(true),
      SearchField.datePeriod('period.start').setPlaceholder('Выбрать период...').setTitle('Период времени')
        .setSortable(true).setSortDirection(Direction.DESC)
    ];
    this.enableFilterCache("meetings");
  }

  loadPage() {
    this._meetingService.getPage(this._searchRequest).subscribe(res => {
      this._page = res;
      this.meetings = res.content;
      this.setLoading(false);
      if (anyMatch(this.role, Role.BUREAU_CHAIRMAN, Role.SECTION_CHAIRMAN)) {
        this.meetings.forEach(meeting => meeting.routerLink = ['/meetings', meeting.id]);
      }
    }, () => this.setLoading(false));
  }

  showCreateMeetingModal() {
    this.createMeetingModal.show(null);
  }
}
