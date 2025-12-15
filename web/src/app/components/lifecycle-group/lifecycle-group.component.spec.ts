import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LifecycleGroupComponent } from './lifecycle-group.component';
import { Router } from '@angular/router';
import { LifecycleGroupService } from '@app/services/lifecycle-group.service';
import { TransitionHistoryService } from '@app/services/transition-history.service';
import { LifecycleService } from '@app/services/lifecycle.service';
import { GlobalToastyService } from '@app/services/global-toasty.service';
import { DialogService } from '@app/components/dialogs/dialog.service';
import { LifecycleGroupDto } from '@app/dto/LifecycleGroupDto';
import { ProjectLifecycleDto } from '@app/dto/ProjectLifecycleDto';
import { ProjectDto } from '@app/dto/ProjectDto';
import { LifecycleGroupState } from '@app/pipes/lifecycle-group-state.pipe';
import { ProjectLifecycleState } from '@app/pipes/lifecycle-state.pipe';
import { Role } from '@app/pipes/role.pipe';
import { of, throwError } from 'rxjs';
import { LifecycleGroupStatePipe } from '@app/pipes/lifecycle-group-state.pipe';
import { CommonModule } from '@angular/common';
import { CommonComponentsModule } from '@app/components/common-components/components.module';
import { SearchModule } from '@app/components/search/search.module';
import { CustomPipesModule } from '@app/pipes/custom-pipes.module';
import { LifecycleStatePipe } from '@app/pipes/lifecycle-state.pipe';
import { SectionPipe } from '@app/pipes/section.pipe';
import { CouncilPipe } from '@app/pipes/council.pipe';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { 
  faPlus, 
  faCog, 
  faSortAmountUp,
  faAngleDoubleLeft, 
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight
} from '@fortawesome/free-solid-svg-icons';

// Моки сервисов
class RouterMock {
  navigate() {
    return Promise.resolve(true);
  }
}

class LifecycleGroupServiceMock {
  prepareGroupCalls: any[] = [];
  deleteLifecycleGroupCalls: any[] = [];
  attachSectionCalls: any[] = [];
  changeSectionCalls: any[] = [];
  generateCouncilConclusionCalls: any[] = [];
  deleteCouncilConclusionCalls: any[] = [];
  generateReferralCalls: any[] = [];
  deleteReferralCalls: any[] = [];
  generateLifecycleGroupDecisionDocumentCalls: any[] = [];
  deleteLifecycleGroupDecisionDocumentCalls: any[] = [];
  saveAnswerForBureauRemarksCalls: any[] = [];
  replyForBureauRemarkCalls: any[] = [];

  prepareGroup(group: LifecycleGroupDto) {
    this.prepareGroupCalls.push(group);
  }

  deleteLifecycleGroup(group: LifecycleGroupDto) {
    this.deleteLifecycleGroupCalls.push(group);
    return of({});
  }

  attachSection(group: LifecycleGroupDto, sectionId: number) {
    this.attachSectionCalls.push({ group, sectionId });
    const lifecycle = new ProjectLifecycleDto();
    lifecycle.id = sectionId;
    return of(lifecycle);
  }

  changeSection(lifecycle: ProjectLifecycleDto, group: LifecycleGroupDto, sectionId: number) {
    this.changeSectionCalls.push({ lifecycle, group, sectionId });
    const updatedGroup = new LifecycleGroupDto();
    updatedGroup.lifecycles = [...group.lifecycles];
    return of(updatedGroup);
  }

  generateCouncilConclusion(group: LifecycleGroupDto, form: any) {
    this.generateCouncilConclusionCalls.push({ group, form });
    return of({ id: 1 });
  }

  deleteCouncilConclusion(conclusion: any, group: LifecycleGroupDto, callback: Function) {
    this.deleteCouncilConclusionCalls.push({ conclusion, group, callback });
    if (callback) callback();
  }

  generateReferral(group: LifecycleGroupDto, form: any) {
    this.generateReferralCalls.push({ group, form });
    return of({ id: 1 });
  }

  deleteReferral(referral: any, group: LifecycleGroupDto, callback: Function) {
    this.deleteReferralCalls.push({ referral, group, callback });
    if (callback) callback();
  }

  generateLifecycleGroupDecisionDocument(group: LifecycleGroupDto, form: any) {
    this.generateLifecycleGroupDecisionDocumentCalls.push({ group, form });
    return of({ id: 1 });
  }

  deleteLifecycleGroupDecisionDocument(decision: any, group: LifecycleGroupDto, callback: Function) {
    this.deleteLifecycleGroupDecisionDocumentCalls.push({ decision, group, callback });
    if (callback) callback();
  }

  saveAnswerForBureauRemarks(group: LifecycleGroupDto) {
    this.saveAnswerForBureauRemarksCalls.push(group);
    return of({});
  }

  replyForBureauRemark(group: LifecycleGroupDto) {
    this.replyForBureauRemarkCalls.push(group);
    return of(new ProjectDto());
  }
}

class TransitionHistoryServiceMock {
  getGroupHistoryCalls: any[] = [];
  getLifecycleHistoryCalls: any[] = [];

  getGroupHistory(group: LifecycleGroupDto) {
    this.getGroupHistoryCalls.push(group);
    return of({});
  }

  getLifecycleHistory(lifecycle: ProjectLifecycleDto) {
    this.getLifecycleHistoryCalls.push(lifecycle);
    return of({});
  }
}

class LifecycleServiceMock {
  deleteLifecycleCalls: any[] = [];
  saveAnswerForSectionRemarksCalls: any[] = [];
  replyForSectionRemarkCalls: any[] = [];

  deleteLifecycle(lifecycle: ProjectLifecycleDto) {
    this.deleteLifecycleCalls.push(lifecycle);
    return of({});
  }

  saveAnswerForSectionRemarks(lifecycle: ProjectLifecycleDto) {
    this.saveAnswerForSectionRemarksCalls.push(lifecycle);
    return of({});
  }

  replyForSectionRemark(lifecycle: ProjectLifecycleDto) {
    this.replyForSectionRemarkCalls.push(lifecycle);
    return of(new ProjectDto());
  }
}

class GlobalToastyServiceMock {
  successCalls: string[] = [];
  errorCalls: string[] = [];

  success(message: string) {
    this.successCalls.push(message);
  }

  error(message: string) {
    this.errorCalls.push(message);
  }
}

class DialogServiceMock {
  showConfirmDialogCalls: any[] = [];

  showConfirmDialog(title: string, message: string, warning?: string) {
    this.showConfirmDialogCalls.push({ title, message, warning });
    return of(true);
  }
}

describe('LifecycleGroupComponent', () => {
  let component: LifecycleGroupComponent;
  let fixture: ComponentFixture<LifecycleGroupComponent>;
  let lifecycleGroupService: LifecycleGroupServiceMock;
  let transitionHistoryService: TransitionHistoryServiceMock;
  let lifecycleService: LifecycleServiceMock;
  let toastyService: GlobalToastyServiceMock;
  let dialogService: DialogServiceMock;

  beforeEach(async () => {
    lifecycleGroupService = new LifecycleGroupServiceMock();
    transitionHistoryService = new TransitionHistoryServiceMock();
    lifecycleService = new LifecycleServiceMock();
    toastyService = new GlobalToastyServiceMock();
    dialogService = new DialogServiceMock();

    await TestBed.configureTestingModule({
      declarations: [
        LifecycleGroupComponent,
        LifecycleGroupStatePipe,
        LifecycleStatePipe,
        SectionPipe,
        CouncilPipe
      ],
      imports: [
        CommonModule,
        CommonComponentsModule,
        SearchModule,
        CustomPipesModule
      ],
      providers: [
        { provide: Router, useClass: RouterMock },
        { provide: LifecycleGroupService, useValue: lifecycleGroupService },
        { provide: TransitionHistoryService, useValue: transitionHistoryService },
        { provide: LifecycleService, useValue: lifecycleService },
        { provide: GlobalToastyService, useValue: toastyService },
        { provide: DialogService, useValue: dialogService }
      ]
    }).compileComponents();

    // Регистрация иконок FontAwesome
    const iconLibrary = TestBed.inject(FaIconLibrary);
    iconLibrary.addIcons(faPlus, faCog, faSortAmountUp, faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight);

    fixture = TestBed.createComponent(LifecycleGroupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should initialize project input signal with default value', () => {
      const defaultProject = component.project();
      expect(defaultProject).toBeInstanceOf(ProjectDto);
    });

    it('should set group input and prepare it via service', () => {
      const group = new LifecycleGroupDto();
      group.id = 1;
      group.state = LifecycleGroupState.ON_CHECKING;

      component.group = group;

      expect(component._group).toBe(group);
      expect(lifecycleGroupService.prepareGroupCalls.length).toBe(1);
      expect(lifecycleGroupService.prepareGroupCalls[0]).toBe(group);
    });

    it('should not set group if value is null', () => {
      component.group = null;
      expect(component._group).toBeUndefined();
      expect(lifecycleGroupService.prepareGroupCalls.length).toBe(0);
    });

    it('should handle projectValue getter with fallback', () => {
      const project = new ProjectDto();
      project.title = 'Test Project';
      fixture.componentRef.setInput('project', project);
      fixture.detectChanges();

      expect(component.projectValue.title).toBe('Test Project');
    });
  });

  describe('ngFor rendering and trackBy', () => {
    beforeEach(() => {
      const group = new LifecycleGroupDto();
      group.id = 1;
      group.lifecycles = [
        { id: 1, state: ProjectLifecycleState.ON_CHOOSING_MEETING } as ProjectLifecycleDto,
        { id: 2, state: ProjectLifecycleState.READY_FOR_MEETING } as ProjectLifecycleDto,
        { id: 3, state: ProjectLifecycleState.ON_EXPERT_EXAMINATION } as ProjectLifecycleDto
      ];
      component.group = group;
      fixture.detectChanges();
    });

    it('should track lifecycle by id', () => {
      const lifecycle1 = component._group.lifecycles[0];
      const lifecycle2 = component._group.lifecycles[1];

      const track1 = component.trackByLifecycle(0, lifecycle1);
      const track2 = component.trackByLifecycle(1, lifecycle2);

      expect(track1).toBe(1);
      expect(track2).toBe(2);
    });

    it('should track lifecycle by index when id is missing', () => {
      const lifecycle = { id: null } as ProjectLifecycleDto;
      const track = component.trackByLifecycle(5, lifecycle);
      expect(track).toBe(5);
    });

    it('should render all lifecycles in ngFor', () => {
      expect(component._group.lifecycles.length).toBe(3);
    });
  });

  describe('Outputs', () => {
    it('should emit onChanged when changed() is called', () => {
      const group = new LifecycleGroupDto();
      component._group = group;
      spyOn(component.onChanged, 'emit');

      component.changed();

      expect(component.onChanged.emit).toHaveBeenCalledWith(group);
    });

    it('should emit onDeleted when group is deleted', () => {
      const group = new LifecycleGroupDto();
      component._group = group;
      spyOn(component.onDeleted, 'emit');

      component.deleteLifecycleGroup(group);
      fixture.detectChanges();

      expect(component.onDeleted.emit).toHaveBeenCalledWith(group);
      expect(toastyService.successCalls).toContain('ГЭС удалён.');
    });

    it('should emit onReplyChanged when replying to section remark', () => {
      const lifecycle = new ProjectLifecycleDto();
      lifecycle.remarks = [];
      component.lifecycleRemark = lifecycle;
      const project = new ProjectDto();
      project.title = 'Updated Project';
      lifecycleService.replyForSectionRemark = jasmine.createSpy().and.returnValue(of(project));
      spyOn(component.onReplyChanged, 'emit');

      component.replyForSectionRemark([]);
      fixture.detectChanges();

      expect(component.onReplyChanged.emit).toHaveBeenCalled();
    });
  });

  describe('Component lifecycle', () => {
    it('should initialize project in ngOnInit', () => {
      const project = new ProjectDto();
      project.title = 'Test';
      fixture.componentRef.setInput('project', project);
      fixture.detectChanges();

      component.ngOnInit();

      expect(component._project).toBe(project);
    });

    it('should unsubscribe from all subscriptions in ngOnDestroy', () => {
      const group = new LifecycleGroupDto();
      component.group = group;
      // Создаем мок для transitionHistoryModal
      component.transitionHistoryModal = {
        show: jasmine.createSpy('show')
      } as any;
      component.showTransitionHistoryModal();
      fixture.detectChanges();

      expect(component['subscriptions'].length).toBeGreaterThan(0);

      component.ngOnDestroy();

      expect(component['subscriptions'].length).toBe(0);
    });
  });

  describe('Permission methods', () => {
    it('canEditSections should return true for ON_CHECKING state and BUREAU_CHAIRMAN role', () => {
      const group = new LifecycleGroupDto();
      group.state = LifecycleGroupState.ON_CHECKING;
      component._group = group;
      fixture.componentRef.setInput('role', Role.BUREAU_CHAIRMAN);
      fixture.detectChanges();

      expect(component.canEditSections()).toBe(true);
    });

    it('canEditSections should return false for other states', () => {
      const group = new LifecycleGroupDto();
      group.state = LifecycleGroupState.IN_PROCESSING;
      component._group = group;
      fixture.componentRef.setInput('role', Role.BUREAU_CHAIRMAN);
      fixture.detectChanges();

      expect(component.canEditSections()).toBe(false);
    });

    it('canChangeSections should return true for IN_PROCESSING state and valid lifecycle state', () => {
      const group = new LifecycleGroupDto();
      group.state = LifecycleGroupState.IN_PROCESSING;
      component._group = group;
      fixture.componentRef.setInput('role', Role.BUREAU_CHAIRMAN);
      fixture.detectChanges();
      const lifecycle = { state: ProjectLifecycleState.ON_CHOOSING_MEETING } as ProjectLifecycleDto;

      expect(component.canChangeSections(lifecycle)).toBe(true);
    });
  });
});

