import {Component, Type, ViewContainerRef, ChangeDetectionStrategy, ChangeDetectorRef, effect, input, viewChild, untracked} from "@angular/core";
import {DocumentForm} from "@app/components/document-form/document-form";
import {FormContent} from "@app/components/document-form/form-model/FormContent";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-document-form',
    templateUrl: 'document-form-container.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class DocumentFormContainerComponent<Form extends FormContent> extends DocumentForm<Form> {
  _formRenderer: Type<DocumentForm<Form>>;
  formComponent: DocumentForm<Form>;
  readonly formContainer = viewChild('form', { read: ViewContainerRef });

  readonly formRenderer = input<Type<DocumentForm<Form>> | undefined>(undefined);
  private readonly _formRendererEffect = effect(() => {
    const formRenderer = this.formRenderer();
    if (!formRenderer) return;
    // Важно: effect должен зависеть ТОЛЬКО от formRenderer().
    // updateFormComponent() читает другие signals (formContainer(), formValue()) и может сам спровоцировать цикл CD (NG0103),
    // если их чтение попадёт в dependency-tracking effect'а.
    if (this._formRenderer === formRenderer && this.formComponent) {
      return;
    }
    untracked(() => this.updateFormComponent(formRenderer));
  });

  constructor(protected cdr: ChangeDetectorRef) {
    super();
  }

  updateFormComponent(formRenderer) {
    const container = this.formContainer();
    if (!container) {
      return;
    }
    container.clear();

    const componentRef = container.createComponent(formRenderer);
    this.formComponent = componentRef.instance as DocumentForm<Form>;
    if (this._formRenderer && this._formRenderer !== formRenderer) {
      console.warn('change of document form container is bad practice!');
    }
    this._formRenderer = formRenderer;
    const current = this.formValue();
    if (current) {
      this.formComponent.setForm(current);
    }
    this.beforeFormMarkForCheck?.();
  }

  /**
   * Хук для подклассов: вызывается после setForm и до markForCheck.
   * Используется, например, чтобы установить project на форме до первой отрисовки.
   */
  protected beforeFormMarkForCheck?(): void;

  getForm(): Form {
    if (!this.formComponent) throw new Error('DocumentFormContainer: form not initialized');
    return this.formComponent.getForm();
  }

  validate() {
    if (!this.formComponent) return;
    this.formComponent.validate();
  }

  override setForm(form: Form) {
    super.setForm(form)
    if (this.formComponent) {
      // Используем untracked, чтобы избежать бесконечного цикла change detection
      untracked(() => {
        this.formComponent.setForm(this.formValue());
      });
    }
    // При использовании signals setForm() обновляет signal, который автоматически триггерит CD,
    // markForCheck() не нужен и может вызывать бесконечные циклы
  }
}
