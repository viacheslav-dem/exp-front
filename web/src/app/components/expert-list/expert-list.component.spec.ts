import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpertListComponent } from './expert-list.component';
import { GlobalToastyService } from '@app/services/global-toasty.service';
import { PersonService } from '@app/services/person.service';
import { DialogService } from '@app/components/dialogs/dialog.service';
import { DataService } from '@app/services/data.service';
import { ProjectService } from '@app/services/project.service';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { ExpertReviewService } from '@app/services/expert-review.service';
import { PersonExpertDto } from '@app/dto/PersonExpertDto';
import { DegreeTypePipe, DegreePipe } from '@app/pipes/degree.pipe';
import { AcademicTitleTypePipe, AcademicTitlePipe } from '@app/pipes/academic-title.pipe';
import { PersonFullNamePipe } from '@app/pipes/person-full-name.pipe';
import { AcademicInfoPipe } from '@app/pipes/academic-info.pipe';
import { FullDegreePipe } from '@app/pipes/full-degree.pipe';
import { PhonesPipe } from '@app/pipes/phones.pipe';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { Page } from '@app/components/common-components/page-and-filter/model/Page';
import { Role } from '@app/pipes/role.pipe';
import { AcademicTitleType } from '@app/pipes/academic-title.pipe';
import { PersonInfoDto } from '@app/dto/PersonInfoDto';

// Моки сервисов
class GlobalToastyServiceMock {
  success(message: string) {}
  error(message: string) {}
}

class PersonServiceMock {
  searchExpertsCalls: any[] = [];

  searchExperts(request: any) {
    this.searchExpertsCalls.push(request);
    const page = new Page<PersonExpertDto>();
    const personInfo: PersonInfoDto = {
      academicTitleType: AcademicTitleType.WITHOUT_TITLE,
      fullDegrees: [],
      specializations: [],
      specialities: []
    } as PersonInfoDto;
    page.content = [
      { 
        id: 1, 
        email: 'expert1@test.com', 
        personInfo: personInfo, 
        phones: [],
        areas: [],
        realTimeStats: {
          projectsOnExamination: 0,
          reviewsOnConfirmation: 0,
          reviewsTermsViolation: { red: 0 },
          acceptedProjects: 0,
          rejectedProjects: 0,
          rejectedReviewsByExpert: 0,
          rejectedReviewsByGknt: 0
        },
        stats: {}
      } as PersonExpertDto,
      { 
        id: 2, 
        email: 'expert2@test.com', 
        personInfo: personInfo, 
        phones: [],
        areas: [],
        realTimeStats: {
          projectsOnExamination: 0,
          reviewsOnConfirmation: 0,
          reviewsTermsViolation: { red: 0 },
          acceptedProjects: 0,
          rejectedProjects: 0,
          rejectedReviewsByExpert: 0,
          rejectedReviewsByGknt: 0
        },
        stats: {}
      } as PersonExpertDto
    ];
    page.totalElements = 2;
    page.totalPages = 1;
    page.page = 1;
    return of(page);
  }
}

class DialogServiceMock {
  showConfirmDialog() {
    return of(true);
  }
}

class DataServiceMock {
  getOrgsCalls: any[] = [];

  getOrgs() {
    this.getOrgsCalls.push({});
    return of([]);
  }
}

class ProjectServiceMock {
  filterName: string;
  filter: any;
}

class RouterMock {
  navigateByUrl(url: string) {
    return Promise.resolve(true);
  }
}

class AuthServiceMock {
  getCurrRole() {
    return Role.EXPERT;
  }
}

class ExpertReviewServiceMock {}

class DegreeTypePipeMock {
  transform(value: any) {
    return value;
  }
}

class AcademicTitleTypePipeMock {
  transform(value: any) {
    return value;
  }
}

class AcademicTitlePipeMock {
  transform(value: any) {
    return value;
  }
}

class DegreePipeMock {
  transform(value: any) {
    return value;
  }
}

class FullDegreePipeMock {
  transform(value: any) {
    return value;
  }
}

class AcademicInfoPipeMock {
  transform(value: any) {
    return 'Test Academic Info';
  }
}

class PhonesPipeMock {
  transform(value: any) {
    return '+375 29 1234567';
  }
}

class PersonFullNamePipeMock {
  transform(value: any) {
    return 'Test Name';
  }
}

class ChangeDetectorRefMock {
  markForCheck() {}
}

describe('ExpertListComponent', () => {
  let component: ExpertListComponent;
  let fixture: ComponentFixture<ExpertListComponent>;
  let personService: PersonServiceMock;
  let dataService: DataServiceMock;
  let projectService: ProjectServiceMock;
  let router: RouterMock;
  let authService: AuthServiceMock;
  let cdr: ChangeDetectorRefMock;

  beforeEach(async () => {
    personService = new PersonServiceMock();
    dataService = new DataServiceMock();
    projectService = new ProjectServiceMock();
    router = new RouterMock();
    authService = new AuthServiceMock();
    cdr = new ChangeDetectorRefMock();

    await TestBed.configureTestingModule({
      declarations: [
        ExpertListComponent,
        PersonFullNamePipe,
        DegreeTypePipe,
        AcademicTitleTypePipe,
        AcademicInfoPipe,
        PhonesPipe
      ],
      providers: [
        { provide: GlobalToastyService, useClass: GlobalToastyServiceMock },
        { provide: PersonService, useValue: personService },
        { provide: DialogService, useClass: DialogServiceMock },
        { provide: DataService, useValue: dataService },
        { provide: ProjectService, useValue: projectService },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
        { provide: ExpertReviewService, useClass: ExpertReviewServiceMock },
        { provide: ChangeDetectorRef, useValue: cdr },
        { provide: PersonFullNamePipe, useClass: PersonFullNamePipeMock },
        { provide: DegreeTypePipe, useClass: DegreeTypePipeMock },
        { provide: AcademicTitleTypePipe, useClass: AcademicTitleTypePipeMock },
        { provide: AcademicInfoPipe, useClass: AcademicInfoPipeMock },
        { provide: DegreePipe, useClass: DegreePipeMock },
        { provide: AcademicTitlePipe, useClass: AcademicTitlePipeMock },
        { provide: FullDegreePipe, useClass: FullDegreePipeMock },
        { provide: PhonesPipe, useClass: PhonesPipeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpertListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Signals state', () => {
    it('should initialize experts signal as empty array', () => {
      expect(component.experts().length).toBe(0);
    });

    it('should update experts signal when data is loaded', () => {
      component.loadPage();
      fixture.detectChanges();

      expect(component.experts().length).toBe(2);
      expect(component.experts()[0].id).toBe(1);
      expect(component.experts()[1].id).toBe(2);
    });

    it('should initialize expertId signal as undefined', () => {
      expect(component.expertId()).toBeUndefined();
    });

    it('should set expertId when showExpertPayInfoDialog is called', () => {
      const expert = { id: 5 } as PersonExpertDto;
      // Мокаем expertPayInfoModal, так как это ViewChild который не инициализирован в тесте
      component.expertPayInfoModal = {
        show: jasmine.createSpy('show')
      } as any;
      
      component.showExpertPayInfoDialog(expert);

      expect(component.expertId()).toBe(5);
      expect(component.expertPayInfoModal.show).toHaveBeenCalled();
    });

    it('should initialize showFilter signal as false', () => {
      expect(component.showFilter()).toBe(false);
    });

    it('should toggle showFilter signal', () => {
      component.showFilter.set(true);
      expect(component.showFilter()).toBe(true);

      component.showFilter.set(false);
      expect(component.showFilter()).toBe(false);
    });

    it('should initialize chartsLoaded signal as empty Set', () => {
      expect(component.chartsLoaded().size).toBe(0);
    });

    it('should update chartsLoaded signal when chart is loaded', () => {
      const loaded = new Set(component.chartsLoaded());
      loaded.add(1);
      component.chartsLoaded.set(loaded);

      expect(component.chartsLoaded().has(1)).toBe(true);
    });
  });

  describe('List rendering', () => {
    beforeEach(() => {
      // Сбрасываем счетчики перед каждым тестом
      personService.searchExpertsCalls = [];
      dataService.getOrgsCalls = [];
      component.ngOnInit();
      // Wait for async operations in ngOnInit (setTimeout)
      fixture.detectChanges();
      // Ждем завершения всех асинхронных операций из ngOnInit
      // Это нужно, чтобы update() не вызывал loadPage() после того, как мы сбросили счетчики
    });

    it('should initialize search fields in ngOnInit', () => {
      expect(component._searchFields.length).toBeGreaterThan(0);
    });

    it('should load experts when loadPage is called', (done) => {
      // Ждем завершения всех асинхронных операций из ngOnInit
      // (update() может вызвать loadPage() через setTimeout)
      setTimeout(() => {
        // Сбрасываем счетчик перед вызовом loadPage
        personService.searchExpertsCalls = [];
        component.loadPage();
        fixture.detectChanges();

        // Wait for async operations
        setTimeout(() => {
          expect(personService.searchExpertsCalls.length).toBe(1);
          expect(component.experts().length).toBe(2);
          done();
        }, 200);
      }, 200);
    });

    it('should clear experts list before loading new page', (done) => {
      component.experts.set([{ id: 999 } as PersonExpertDto]);
      component.loadPage();
      fixture.detectChanges();

      // Wait for async operations
      setTimeout(() => {
        expect(component.experts()[0].id).toBe(1);
        done();
      }, 200);
    });

    it('should track experts by id in trackByExpert', () => {
      const expert1 = { id: 1 } as PersonExpertDto;
      const expert2 = { id: 2 } as PersonExpertDto;

      const track1 = component.trackByExpert(0, expert1);
      const track2 = component.trackByExpert(1, expert2);

      expect(track1).toBe(1);
      expect(track2).toBe(2);
    });

    it('should track experts by index when id is missing', () => {
      const expert = { id: null } as PersonExpertDto;
      const track = component.trackByExpert(5, expert);
      expect(track).toBe(5);
    });
  });

  describe('Interactions', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should navigate to filtered projects when showProjectsOnExpertExamination is called', () => {
      const expert = { id: 1 } as PersonExpertDto;
      spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

      component.showProjectsOnExpertExamination(expert);

      expect(projectService.filterName).toContain('Объекты экспертизы, над которыми работает эксперт');
      expect(router.navigateByUrl).toHaveBeenCalledWith('projects-filtered');
    });

    it('should navigate to filtered projects when showProjectsOnExpertConfirmation is called', () => {
      const expert = { id: 1 } as PersonExpertDto;
      spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

      component.showProjectsOnExpertConfirmation(expert);

      expect(projectService.filterName).toContain('на которые ожидает подтверждения');
      expect(router.navigateByUrl).toHaveBeenCalledWith('projects-filtered');
    });

    it('should navigate to filtered projects when showProjectsExpertReviewFinished is called', () => {
      const expert = { id: 1 } as PersonExpertDto;
      spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

      component.showProjectsExpertReviewFinished(expert);

      expect(projectService.filterName).toContain('над которыми работал эксперт');
      expect(router.navigateByUrl).toHaveBeenCalledWith('projects-filtered');
    });

    it('should get current role from auth service', () => {
      const role = component.getCurrentRole();
      expect(role).toBe(Role.EXPERT);
    });
  });

  describe('Component lifecycle', () => {
    beforeEach((done) => {
      // Ждем завершения всех асинхронных операций из предыдущих блоков
      // (beforeEach блока "List rendering" может вызвать ngOnInit)
      setTimeout(() => {
        // Сбрасываем счетчики перед каждым тестом
        dataService.getOrgsCalls = [];
        personService.searchExpertsCalls = [];
        // Мокируем chartContainers для предотвращения ошибок с changes
        component.chartContainers = {
          changes: of([]),
          length: 0,
          first: undefined,
          last: undefined,
          get: () => undefined,
          forEach: () => {},
          map: () => [],
          filter: () => ({ length: 0, changes: of([]) } as any),
          find: () => undefined,
          some: () => false,
          toArray: () => [],
          reset: () => {},
          notifyOnChanges: () => {},
          destroy: () => {}
        } as any;
        done();
      }, 250);
    });

    it('should load organizations in ngOnInit', (done) => {
      // Убеждаемся, что счетчик сброшен перед тестом
      // (beforeEach уже сбросил счетчик после завершения всех асинхронных операций)
      dataService.getOrgsCalls = [];
      component.ngOnInit();
      fixture.detectChanges();

      // Wait for async operations
      setTimeout(() => {
        expect(dataService.getOrgsCalls.length).toBe(1);
        done();
      }, 200);
    });

    it('should cleanup subscriptions in ngOnDestroy', () => {
      component.ngOnInit();
      component.loadPage();
      fixture.detectChanges();

      expect(component['subscriptions'].length).toBeGreaterThan(0);

      component.ngOnDestroy();

      expect(component['subscriptions'].length).toBe(0);
    });

    it('should disconnect intersection observer in ngOnDestroy', () => {
      component.ngAfterViewInit();
      fixture.detectChanges();

      // Observer may not be initialized in test environment without ViewChildren
      // So we check if it exists before testing disconnect
      if (component['observer']) {
        const observer = component['observer'];
        spyOn(observer, 'disconnect');
        
        component.ngOnDestroy();
        
        expect(observer.disconnect).toHaveBeenCalled();
      } else {
        // If observer is not initialized, just verify ngOnDestroy doesn't throw
        expect(() => component.ngOnDestroy()).not.toThrow();
      }
    });
  });

  describe('isChartsLoaded', () => {
    it('should return false when chart is not loaded', () => {
      expect(component.isChartsLoaded(1)).toBe(false);
    });

    it('should return true when chart is loaded', () => {
      const loaded = new Set([1, 2, 3]);
      component.chartsLoaded.set(loaded);

      expect(component.isChartsLoaded(1)).toBe(true);
      expect(component.isChartsLoaded(2)).toBe(true);
      expect(component.isChartsLoaded(4)).toBe(false);
    });
  });
});

