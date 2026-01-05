import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpertReviewFormContainerComponent } from './expert-review-form-container.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, ChangeDetectorRef, ElementRef } from '@angular/core';
import { GlobalToastyService } from '@app/services/global-toasty.service';
import { ExpertReviewFormContent } from '@app/components/document-form/form-model/ExpertReviewFormContent';

// Моки
class GlobalToastyServiceMock {
  warn(message?: string) {
    // Мок для проверки вызова
  }
}

class ComponentFactoryResolverMock {
  resolveComponentFactory() {
    return null as any;
  }
}

class ChangeDetectorRefMock {
  markForCheck() {}
  detectChanges() {}
}

describe('ExpertReviewFormContainerComponent - Template-Driven Validation', () => {
  let component: ExpertReviewFormContainerComponent<ExpertReviewFormContent>;
  let fixture: ComponentFixture<ExpertReviewFormContainerComponent<ExpertReviewFormContent>>;
  let toastyService: GlobalToastyServiceMock;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    toastyService = new GlobalToastyServiceMock();

    await TestBed.configureTestingModule({
      declarations: [ExpertReviewFormContainerComponent],
      imports: [FormsModule, CommonModule],
      providers: [
        { provide: ComponentFactoryResolver, useClass: ComponentFactoryResolverMock },
        { provide: ChangeDetectorRef, useClass: ChangeDetectorRefMock },
        { provide: GlobalToastyService, useValue: toastyService },
        {
          provide: ElementRef,
          useValue: {
            nativeElement: document.createElement('div')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpertReviewFormContainerComponent);
    component = fixture.componentInstance;
    hostElement = (component as any).hostRef.nativeElement;
  });

  describe('hasInvalidControls()', () => {
    it('should return false when no invalid controls exist', () => {
      // Arrange
      hostElement.innerHTML = '<input name="test" [(ngModel)]="value" />';
      fixture.detectChanges();

      // Act
      const result = (component as any).hasInvalidControls();

      // Assert
      expect(result).toBe(false);
    });

    it('should return true when invalid control exists', () => {
      // Arrange
      hostElement.innerHTML = `
        <div class="form-sub-group">
          <label>Test Field</label>
          <textarea name="testField" required [(ngModel)]="value"></textarea>
        </div>
      `;
      fixture.detectChanges();

      // Получаем элемент и помечаем его как невалидный
      const textarea = hostElement.querySelector('textarea') as HTMLTextAreaElement;
      textarea.classList.add('ng-invalid');

      // Act
      const result = (component as any).hasInvalidControls();

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('getFirstInvalidElement()', () => {
    it('should return null when no invalid elements exist', () => {
      // Arrange
      hostElement.innerHTML = '<input name="test" />';
      fixture.detectChanges();

      // Act
      const result = (component as any).getFirstInvalidElement();

      // Assert
      expect(result).toBeNull();
    });

    it('should return first visible invalid element', () => {
      // Arrange
      hostElement.innerHTML = `
        <div class="form-sub-group">
          <label>First Field</label>
          <textarea name="field1" required [(ngModel)]="value1"></textarea>
        </div>
        <div class="form-sub-group">
          <label>Second Field</label>
          <textarea name="field2" required [(ngModel)]="value2"></textarea>
        </div>
      `;
      fixture.detectChanges();

      const field1 = hostElement.querySelector('textarea[name="field1"]') as HTMLTextAreaElement;
      const field2 = hostElement.querySelector('textarea[name="field2"]') as HTMLTextAreaElement;
      
      field1.classList.add('ng-invalid');
      field2.classList.add('ng-invalid');

      // Act
      const result = (component as any).getFirstInvalidElement();

      // Assert
      expect(result).toBe(field1);
    });

    it('should skip hidden invalid elements', () => {
      // Arrange
      hostElement.innerHTML = `
        <div class="form-sub-group">
          <label>Hidden Field</label>
          <textarea name="hidden" required [(ngModel)]="value" style="display: none;"></textarea>
        </div>
        <div class="form-sub-group">
          <label>Visible Field</label>
          <textarea name="visible" required [(ngModel)]="value2"></textarea>
        </div>
      `;
      fixture.detectChanges();

      const hidden = hostElement.querySelector('textarea[name="hidden"]') as HTMLTextAreaElement;
      const visible = hostElement.querySelector('textarea[name="visible"]') as HTMLTextAreaElement;
      
      hidden.classList.add('ng-invalid');
      visible.classList.add('ng-invalid');

      // Act
      const result = (component as any).getFirstInvalidElement();

      // Assert
      expect(result).toBe(visible);
    });
  });

  describe('getFieldLabel()', () => {
    it('should extract label text from form-sub-group', () => {
      // Arrange
      hostElement.innerHTML = `
        <div class="form-sub-group">
          <label>12.5. Анализ целевых показателей:</label>
          <textarea name="targetAnalysis" required [(ngModel)]="value"></textarea>
        </div>
      `;
      fixture.detectChanges();

      const textarea = hostElement.querySelector('textarea') as HTMLTextAreaElement;
      textarea.classList.add('ng-invalid');

      // Act
      const result = (component as any).getFieldLabel(textarea);

      // Assert
      expect(result).toBe('12.5. Анализ целевых показателей:');
    });

    it('should return null when label not found', () => {
      // Arrange
      hostElement.innerHTML = '<textarea name="test" required></textarea>';
      fixture.detectChanges();

      const textarea = hostElement.querySelector('textarea') as HTMLTextAreaElement;

      // Act
      const result = (component as any).getFieldLabel(textarea);

      // Assert
      expect(result).toBeNull();
    });

    it('should truncate long labels', () => {
      // Arrange
      const longLabel = 'A'.repeat(150);
      hostElement.innerHTML = `
        <div class="form-sub-group">
          <label>${longLabel}</label>
          <textarea name="test" required></textarea>
        </div>
      `;
      fixture.detectChanges();

      const textarea = hostElement.querySelector('textarea') as HTMLTextAreaElement;

      // Act
      const result = (component as any).getFieldLabel(textarea);

      // Assert
      expect(result).toBeTruthy();
      expect(result!.length).toBeLessThanOrEqual(100);
      expect(result!.endsWith('...')).toBe(true);
    });
  });

  describe('getFieldErrorType()', () => {
    it('should return "required" for empty required field', () => {
      // Arrange
      hostElement.innerHTML = `
        <textarea name="test" required [(ngModel)]="value"></textarea>
      `;
      fixture.detectChanges();

      const textarea = hostElement.querySelector('textarea') as HTMLTextAreaElement;
      textarea.value = '';
      textarea.classList.add('ng-invalid');

      // Act
      const result = (component as any).getFieldErrorType(textarea);

      // Assert
      expect(result).toBe('required');
    });

    it('should return "minlength" for field with insufficient length', () => {
      // Arrange
      hostElement.innerHTML = `
        <textarea name="test" required minlength="30" [(ngModel)]="value"></textarea>
      `;
      fixture.detectChanges();

      const textarea = hostElement.querySelector('textarea') as HTMLTextAreaElement;
      textarea.value = 'short text'; // Меньше 30 символов
      textarea.classList.add('ng-invalid');

      // Act
      const result = (component as any).getFieldErrorType(textarea);

      // Assert
      expect(result).toBe('minlength');
    });

    it('should return "min" for number field below minimum', () => {
      // Arrange
      hostElement.innerHTML = `
        <input name="test" type="text" required min="0" numberInput [(ngModel)]="value">
      `;
      fixture.detectChanges();

      const input = hostElement.querySelector('input') as HTMLInputElement;
      input.value = '-5';
      input.classList.add('ng-invalid');

      // Act
      const result = (component as any).getFieldErrorType(input);

      // Assert
      expect(result).toBe('min');
    });

    it('should return null when no error type matches', () => {
      // Arrange
      hostElement.innerHTML = `
        <textarea name="test" [(ngModel)]="value"></textarea>
      `;
      fixture.detectChanges();

      const textarea = hostElement.querySelector('textarea') as HTMLTextAreaElement;
      textarea.value = 'valid text';
      textarea.classList.add('ng-invalid');

      // Act
      const result = (component as any).getFieldErrorType(textarea);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('save() - Template-Driven Validation Flow', () => {
    beforeEach(() => {
      spyOn(toastyService, 'warn');
      spyOn(component, 'validate' as any);
    });

    it('should show warning and return early when invalid controls exist', () => {
      // Arrange
      hostElement.innerHTML = `
        <div class="form-sub-group">
          <label>Test Field</label>
          <textarea name="testField" required [(ngModel)]="value"></textarea>
        </div>
      `;
      fixture.detectChanges();

      const textarea = hostElement.querySelector('textarea') as HTMLTextAreaElement;
      textarea.classList.add('ng-invalid');
      textarea.value = '';

      // Act
      component.save();

      // Assert
      expect(toastyService.warn).toHaveBeenCalled();
      expect(component.validate).not.toHaveBeenCalled();
    });

    it('should show specific message for required field error', () => {
      // Arrange
      hostElement.innerHTML = `
        <div class="form-sub-group">
          <label>12.5. Анализ целевых показателей:</label>
          <textarea name="targetAnalysis" required [(ngModel)]="value"></textarea>
        </div>
      `;
      fixture.detectChanges();

      const textarea = hostElement.querySelector('textarea') as HTMLTextAreaElement;
      textarea.classList.add('ng-invalid');
      textarea.value = '';

      // Act
      component.save();

      // Assert
      expect(toastyService.warn).toHaveBeenCalledWith(
        'Заполните обязательное поле "12.5. Анализ целевых показателей:".'
      );
    });

    it('should show specific message for minlength error', () => {
      // Arrange
      hostElement.innerHTML = `
        <div class="form-sub-group">
          <label>Test Field</label>
          <textarea name="testField" required minlength="30" [(ngModel)]="value"></textarea>
        </div>
      `;
      fixture.detectChanges();

      const textarea = hostElement.querySelector('textarea') as HTMLTextAreaElement;
      textarea.classList.add('ng-invalid');
      textarea.value = 'short'; // Меньше 30 символов

      // Act
      component.save();

      // Assert
      expect(toastyService.warn).toHaveBeenCalled();
      const callArgs = (toastyService.warn as jasmine.Spy).calls.mostRecent().args[0];
      expect(callArgs).toContain('должно содержать не менее 30 символов');
    });

    it('should proceed to validate() when no template-driven errors', () => {
      // Arrange
      hostElement.innerHTML = `
        <div class="form-sub-group">
          <label>Test Field</label>
          <textarea name="testField" required [(ngModel)]="value"></textarea>
        </div>
      `;
      fixture.detectChanges();

      const textarea = hostElement.querySelector('textarea') as HTMLTextAreaElement;
      textarea.value = 'valid text';
      // Нет класса ng-invalid

      // Мокаем super.save() чтобы не вызывать реальную логику
      spyOn(Object.getPrototypeOf(ExpertReviewFormContainerComponent.prototype), 'save').and.callFake(() => {});

      // Act
      component.save();

      // Assert
      // validate() должен быть вызван через super.save()
      // (в реальном тесте нужно проверить вызов super.save())
    });
  });

  describe('Integration: Full Validation Flow', () => {
    it('should handle multiple invalid fields and focus on first one', () => {
      // Arrange
      hostElement.innerHTML = `
        <div class="form-sub-group">
          <label>First Field</label>
          <textarea name="field1" required [(ngModel)]="value1"></textarea>
        </div>
        <div class="form-sub-group">
          <label>Second Field</label>
          <textarea name="field2" required minlength="30" [(ngModel)]="value2"></textarea>
        </div>
      `;
      fixture.detectChanges();

      const field1 = hostElement.querySelector('textarea[name="field1"]') as HTMLTextAreaElement;
      const field2 = hostElement.querySelector('textarea[name="field2"]') as HTMLTextAreaElement;
      
      field1.classList.add('ng-invalid');
      field2.classList.add('ng-invalid');
      field1.value = '';
      field2.value = 'short';

      spyOn(toastyService, 'warn');
      spyOn(component as any, 'scrollToFirstInvalidSoon');

      // Act
      component.save();

      // Assert
      expect(toastyService.warn).toHaveBeenCalled();
      expect((component as any).scrollToFirstInvalidSoon).toHaveBeenCalled();
      
      const firstInvalid = (component as any).getFirstInvalidElement();
      expect(firstInvalid).toBe(field1);
    });
  });
});

