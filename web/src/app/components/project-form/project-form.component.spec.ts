import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectFormComponent } from './project-form.component';
import { DataService } from '@app/services/data.service';
import { PersonService } from '@app/services/person.service';
import { FundingTypePipe } from '@app/pipes/funding-type.pipe';
import { PersonFullNamePipe } from '@app/pipes/person-full-name.pipe';
import { ViewContainerRef } from '@angular/core';
import { ProjectDto } from '@app/dto/ProjectDto';
import { PeriodDto } from '@app/dto/PeriodDto';
import { DirectionDto } from '@app/dto/DirectionDto';
import { SubDirectionDto } from '@app/dto/SubDirectionDto';
import { FundingDto } from '@app/dto/FundingDto';
import { ExpectedResultDto } from '@app/dto/ExpectedResultDto';
import { CatalogDto } from '@app/dto/CatalogDto';
import { of } from 'rxjs';
import { ResultSpecificEnum, TypeOfWorkEnum } from './project-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';

// Моки сервисов
class DataServiceMock {
  getCatalogCalls: any[] = [];
  getExpectedResultCalls: any[] = [];
  getCommercializationMethodsCalls: any[] = [];

  getCatalog(catalog: any) {
    this.getCatalogCalls.push(catalog);
    return of([{ id: 1, code: '8.1', name: 'Test Code' }]);
  }

  getExpectedResult() {
    this.getExpectedResultCalls.push({});
    const result = new ExpectedResultDto();
    result.expectedResultType = 'другое';
    return of([result]);
  }

  getCommercializationMethods() {
    this.getCommercializationMethodsCalls.push({});
    return of([{ id: 1, name: 'Method 1' } as CatalogDto]);
  }
}

class PersonServiceMock {
  getCurrentPersonCalls: any[] = [];

  getCurrentPerson() {
    this.getCurrentPersonCalls.push({});
    return of({ id: 1, name: 'Test Customer' });
  }
}

class FundingTypePipeMock {
  transform(value: any) {
    return value;
  }
}

class ViewContainerRefMock {}

describe('ProjectFormComponent', () => {
  let component: ProjectFormComponent;
  let fixture: ComponentFixture<ProjectFormComponent>;
  let dataService: DataServiceMock;
  let personService: PersonServiceMock;

  beforeEach(async () => {
    dataService = new DataServiceMock();
    personService = new PersonServiceMock();

    await TestBed.configureTestingModule({
      declarations: [ProjectFormComponent, PersonFullNamePipe, FundingTypePipe],
      imports: [FormsModule, CommonModule, FontAwesomeModule],
      providers: [
        { provide: ViewContainerRef, useClass: ViewContainerRefMock },
        { provide: DataService, useValue: dataService },
        { provide: PersonService, useValue: personService }
      ]
    }).compileComponents();

    // Регистрация иконок FontAwesome
    const iconLibrary = TestBed.inject(FaIconLibrary);
    iconLibrary.addIcons(faMinus);

    fixture = TestBed.createComponent(ProjectFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize with default values', () => {
      expect(component.directions).toEqual([]);
      expect(component.funding).toBeInstanceOf(FundingDto);
      expect(component.allFundingType.length).toBeGreaterThan(0);
    });

    it('should load project codes in ngOnInit', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(dataService.getCatalogCalls.length).toBeGreaterThan(0);
    });

    it('should load current person in ngOnInit', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(personService.getCurrentPersonCalls.length).toBe(1);
      expect(component.customer).toBeTruthy();
    });

    it('should load expected results in ngOnInit', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(dataService.getExpectedResultCalls.length).toBe(1);
      expect(component.expectedResultList.length).toBeGreaterThan(0);
    });

    it('should load commercialization methods in ngOnInit', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(dataService.getCommercializationMethodsCalls.length).toBe(1);
      expect(component.commercializationMethods.length).toBeGreaterThan(0);
    });

    it('should initialize project with default values when set to null', () => {
      component.project = null;

      expect(component._project).toBeInstanceOf(ProjectDto);
      expect(component._project.period).toBeInstanceOf(PeriodDto);
    });

    it('should initialize project with provided values', () => {
      const project = new ProjectDto();
      project.title = 'Test Project';
      project.directions = [];
      project.subDirections = [];

      component.project = project;

      expect(component._project.title).toBe('Test Project');
    });
  });

  describe('Submit flow', () => {
    let project: ProjectDto;

    beforeEach(() => {
      project = new ProjectDto();
      project.title = 'Test Project';
      project.code = { id: 1, code: '8.1' } as any;
      project.executor = 'Test Executor';
      project.period = new PeriodDto();
      project.period.start = Date.now();
      project.period.end = Date.now() + 86400000;
      project.directions = [];
      project.subDirections = [];
      component.project = project;
    });

    it('should emit save event when onSave is called with valid project', () => {
      spyOn(component.save, 'emit');

      component.onSave();

      expect(component.save.emit).toHaveBeenCalledWith(project);
    });

    it('should throw error when title is empty', () => {
      project.title = '';

      expect(() => component.onSave()).toThrow('Наименование объекта экспертизы не может быть пустым.');
    });

    it('should throw error when code is not selected', () => {
      project.code = null;

      expect(() => component.onSave()).toThrow('Пожалуйста, выберите код объекта экспертизы.');
    });

    it('should throw error when executor is empty', () => {
      project.executor = '';

      expect(() => component.onSave()).toThrow('Пожалуйста, укажите исполнителей и соисполнителей объекта экспертизы.');
    });

    it('should throw error when period dates are invalid', () => {
      project.period.start = Date.now() + 86400000;
      project.period.end = Date.now();

      expect(() => component.onSave()).toThrow('Дата начала не может быть больше даты окончания.');
    });

    it('should prepare directions and subDirections before saving', () => {
      const direction = new DirectionDto();
      direction.id = 1;
      const subDirection = new SubDirectionDto();
      subDirection.id = 1;
      subDirection.direction = direction;
      direction.subDirectionDtos = [subDirection];
      component.directions = [direction];

      component.onSave();

      expect(project.directions.length).toBe(1);
      expect(project.subDirections.length).toBe(1);
    });

    it('should clear socialEconomicGoals when canAddSocialEconomicGoals is false', () => {
      project.code = { id: 1, code: '8.1' } as any;
      project.socialEconomicGoals = [{ id: 1 } as CatalogDto];

      component.onSave();

      expect(project.socialEconomicGoals.length).toBe(0);
    });

    it('should validate expected result block when onSave is called', () => {
      project.code = { id: 1, code: '8.2' } as any;
      project.expectedResult = new ExpectedResultDto();
      project.expectedResult.expectedResultType = 'другое';
      project.otherExpectedResult = '';
      project.expectedResultDescription = '';

      expect(() => component.onSave()).toThrow();
    });
  });

  describe('Cancel flow', () => {
    it('should emit cancel event when onCancel is called', () => {
      spyOn(component.cancel, 'emit');

      component.onCancel();

      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });

  describe('Direction management', () => {
    it('should add new direction when addDirection is called', () => {
      component.newDirection = { id: 1 } as DirectionDto;
      component.subDirection = { id: 1 } as SubDirectionDto;

      component.addDirection();

      expect(component.directions.length).toBe(1);
      expect(component.directions[0].subDirectionDtos.length).toBe(1);
    });

    it('should add subDirection to existing direction when direction already exists', () => {
      const direction = new DirectionDto();
      direction.id = 1;
      direction.subDirectionDtos = [];
      component.directions = [direction];
      component.newDirection = { id: 1 } as DirectionDto;
      component.subDirection = { id: 2 } as SubDirectionDto;

      component.addDirection();

      expect(component.directions.length).toBe(1);
      expect(component.directions[0].subDirectionDtos.length).toBe(1);
    });

    it('should not add duplicate subDirection', () => {
      const direction = new DirectionDto();
      direction.id = 1;
      const subDir = new SubDirectionDto();
      subDir.id = 1;
      direction.subDirectionDtos = [subDir];
      component.directions = [direction];
      component.newDirection = { id: 1 } as DirectionDto;
      component.subDirection = { id: 1 } as SubDirectionDto;

      component.addDirection();

      expect(component.directions[0].subDirectionDtos.length).toBe(1);
    });

    it('should delete direction when deleteDirection is called', () => {
      const direction = new DirectionDto();
      direction.id = 1;
      direction.subDirectionDtos = [];
      component.directions = [direction];

      component.deleteDirection(direction, 0);

      expect(component.directions.length).toBe(0);
    });
  });

  describe('Funding management', () => {
    it('should add funding when addFunding is called with valid data', () => {
      component.funding.type = 'Test Type';
      component.funding.source = { id: 1, name: 'Test Source' } as CatalogDto;
      component.funding.value = 1000;
      component._project = new ProjectDto();
      component._project.financing = [];

      component.addFunding();

      expect(component._project.financing.length).toBe(1);
      expect(component.funding.value).toBeUndefined();
    });

    it('should throw error when funding type is missing', () => {
      component.funding.type = null;

      expect(() => component.addFunding()).toThrow('Пожалуйста, укажите тип финансирования объекта экспертизы.');
    });

    it('should throw error when funding value is negative', () => {
      component.funding.type = 'Test Type';
      component.funding.source = { id: 1, name: 'Test Source' } as CatalogDto;
      component.funding.value = -100;

      expect(() => component.addFunding()).toThrow('Пожалуйста, укажите неотрицательную сумму финансирования объекта экспертизы.');
    });
  });

  describe('Code selection', () => {
    it('should disable expected result button for specific codes', () => {
      component._project = new ProjectDto();
      component._project.code = { id: 1, code: '8.5' } as any;

      component.selectCode(component._project.code);

      expect(component.disableExpectedResultButton).toBe(true);
    });

    it('should enable expected result button for other codes', () => {
      component._project = new ProjectDto();
      component._project.code = { id: 1, code: '8.1' } as any;

      component.selectCode(component._project.code);

      expect(component.disableExpectedResultButton).toBe(false);
    });
  });
});

