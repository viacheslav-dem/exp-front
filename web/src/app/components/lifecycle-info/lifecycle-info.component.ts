import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, input} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from "@angular/router";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {ProjectLifecycleStateBadge} from "@app/pipes/lifecycle-state.pipe";
import {Role} from "@app/pipes/role.pipe";
import {ProjectLifecycleDto} from "@app/dto/ProjectLifecycleDto";
import {ProjectLifecycleTransitionHistoryDto} from "@app/dto/ProjectLifecycleTransitionHistoryDto";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {TransitionHistoryService} from "@app/services/transition-history.service";
import {LifecycleGroupState} from "@app/pipes/lifecycle-group-state.pipe";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-lifecycle-info',
    templateUrl: './lifecycle-info.component.html',
    standalone: false
})
export class LifecycleInfoComponent implements OnInit, OnDestroy {

  ProjectLifecycleStateBadge = ProjectLifecycleStateBadge;
  LifecycleGroupState = LifecycleGroupState;
  Role = Role;
  isExpanded: boolean = false;

  _lifecycle: any;
  transitionHistory: ProjectLifecycleTransitionHistoryDto;
  private subscriptions: Subscription[] = [];

  readonly role = input<string>(undefined);
  readonly project = input<ProjectDto>(undefined);
  @Output() onChanged: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('transitionHistoryModal', { static: false }) transitionHistoryModal: ModalComponent;

  constructor(private route: ActivatedRoute,
              private _toasty: GlobalToastyService,
              private _transitionHistoryService: TransitionHistoryService) {
  }

  ngOnInit() {
  }

  @Input() set lifecycle(lifecycle: ProjectLifecycleDto) {
    if (!lifecycle) return;
    this._lifecycle = lifecycle;
  }

  showTransitionHistoryModal() {
    this.transitionHistoryModal.show();
    this.subscriptions.push(
      this._transitionHistoryService.getLifecycleHistory(this._lifecycle)
        .subscribe(res => this.transitionHistory = res)
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  changed() {
    this.onChanged.emit(this._lifecycle);
  }
}
