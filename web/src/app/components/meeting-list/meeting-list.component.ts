import {ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, DestroyRef, inject, signal, viewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
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
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-meeting-list',
    templateUrl: 'meeting-list.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.meetings) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Eager
})
export class MeetingListComponent extends FilterAndPages<MeetingDto> {

  MeetingStateBadge = MeetingStateBadge;
  Role = Role; // for template, don't remove!

  role: string;
  readonly meetings = signal<MeetingDto[]>([]);
  
  // Computed для добавления routerLink без мутации исходных данных
  readonly meetingsWithLinks = computed(() => {
    const meetingsList = this.meetings();
    if (anyMatch(this.role, Role.BUREAU_CHAIRMAN, Role.SECTION_CHAIRMAN)) {
      return meetingsList.map(meeting => ({
        ...meeting,
        routerLink: ['/meetings', meeting.id]
      }));
    }
    return meetingsList;
  });

  createMeetingModal = viewChild<MeetingFormComponent>(MeetingFormComponent);

  constructor(private _toasty: GlobalToastyService,
              private _authService: AuthService,
              private _meetingService: MeetingService,
              private _meetingStatePipe: MeetingStatePipe,
              private cdr: ChangeDetectorRef) {
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
    // Если нет сохранённого состояния фильтров, загружаем данные явно
    const hasCachedFilters = localStorage.getItem('filter_cache_meetings');
    if (!hasCachedFilters) {
      // update() сам использует setTimeout для setLoading, поэтому прямой вызов безопасен
      this.update();
    }
  }

  loadPage() {
    this.setLoading(true);
    this._meetingService.getPage(this._searchRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this._page = res;
          this.meetings.set(res.content);
          this.setLoading(false);
          // routerLink добавляется через computed, не нужно мутировать исходные данные
          this.cdr?.markForCheck?.();
        },
        error: () => {
          this.setLoading(false);
          this.cdr?.markForCheck?.();
        }
      });
  }

  showCreateMeetingModal() {
    this.createMeetingModal()?.show(null);
  }
}
