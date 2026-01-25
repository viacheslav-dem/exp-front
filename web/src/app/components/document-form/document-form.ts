import {DestroyRef, Directive, OnDestroy, OnInit, effect, inject, input, output, signal, untracked} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormContent} from "@app/components/document-form/form-model/FormContent";
import {DraftService} from "@app/components/document-form/draft.service";
import {IdDto} from "@app/dto/IdDto";
import {Subject, switchMap, takeUntil, tap, timer, catchError, of, timeout} from "rxjs";
import {deepClone} from "@app/support/utils";

@Directive()
export class DocumentForm<Form extends FormContent> implements OnInit, OnDestroy {

  protected readonly destroyRef = inject(DestroyRef);

  private readonly _formSignal = signal<Form>(this.createNewForm());
  /** Текущее значение формы (signal). Использовать только для чтения. */
  readonly formValue = this._formSignal.asReadonly();

  readonly onSave = output<Form>();
  readonly onClose = output<Form>();
  readonly draftService = input<DraftService<Form>>(undefined);
  readonly draftOwner = input<IdDto>(undefined);
  _draftAutoSaveStartTimeMillis = 30000;
  _draftAutoSavePeriodMillis = 30000;

  private autoSaveStop$ = new Subject<void>();

  ngOnInit() {
  }

  readonly form = input<Form>(undefined);

  private readonly formEffect = effect(() => {
    const form = this.form();
    if (!form) {
      return;
    }
    // Используем untracked, чтобы избежать бесконечного цикла change detection
    untracked(() => {
      this.setForm(form);
    });
  });

  startAutoSave() {
    const draftService = this.draftService();
    const draftOwner = this.draftOwner();
    if (!(draftService && draftOwner)) {
      return;
    }
    // Останавливаем предыдущий автосейв (если был) - создаем новый Subject для нового потока
    const previousStop$ = this.autoSaveStop$;
    this.autoSaveStop$ = new Subject<void>();
    // Завершаем предыдущий Subject, чтобы остановить старые подписки
    previousStop$.next();
    previousStop$.complete();

    draftService.getDraft(draftOwner).pipe(
      timeout(30000), // Таймаут 30 секунд для предотвращения бесконечного ожидания
      catchError(err => {
        // Если запрос не удался (нет черновика, таймаут или ошибка), продолжаем с пустой формой
        console.warn('Failed to load draft, continuing with empty form:', err);
        return of(null);
      }),
      tap(res => {
        if (res) {
          // Используем untracked, чтобы избежать бесконечного цикла change detection
          untracked(() => {
            this.setForm(res);
          });
        }
      }),
      switchMap(() => {
        return timer(this._draftAutoSaveStartTimeMillis, this._draftAutoSavePeriodMillis);
      }),
      takeUntil(this.autoSaveStop$), // Используем новый Subject, который еще не эмитил значения
      takeUntilDestroyed(this.destroyRef), // Переместили в конец pipe, чтобы не прерывать Observable до эмита значения
    ).subscribe({
      next: () => this.saveDraft(),
      error: (err) => {
        // Ошибки автосейва не должны ломать UI (особенно в zoneless).
        console.warn('AutoSave subscribe error:', err);
      },
      complete: () => {}
    });
  }

  stopAutoSave() {
    this.autoSaveStop$.next();
  }

  saveDraft() {
    const draftService = this.draftService();
    const draftOwner = this.draftOwner();
    if (draftService && draftOwner) {
      draftService.saveDraft(draftOwner, this.getForm())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }

  createNewForm(): Form {
    return new FormContent() as Form;
  }

  getForm() {
    return deepClone(this._formSignal());
  }

  setForm(form: Form) {
    if (form) {
      // Важно: держим иммутабельное значение для signal-консистентности.
      this._formSignal.set(deepClone(form));
    }
  }

  patchForm(patch: Partial<Form>) {
    this._formSignal.update(current => ({ ...current, ...patch }));
  }

  setField<K extends keyof Form>(key: K, value: Form[K]) {
    this._formSignal.update(current => ({ ...current, [key]: value } as Form));
  }

  updateForm(updater: (form: Form) => Form) {
    this._formSignal.update(current => updater(current));
  }

  /**
   * Фиксация изменений, сделанных через мутацию объекта формы.
   * Важно для обратной совместимости с существующими блоками/формами, которые пока мутируют поля напрямую.
   * Создает shallow copy верхнего уровня формы, что триггерит signal-обновление.
   * 
   * @deprecated Используйте иммутабельные обновления через patchForm()/updateForm() вместо прямой мутации.
   * Этот метод оставлен для обратной совместимости со старыми блоками.
   */
  markFormChanged() {
    // Shallow copy достаточно: signal сравнивает по ссылке верхнего объекта.
    // Даже если вложенные объекты мутированы, новая ссылка на верхний объект триггерит обновление.
    this._formSignal.update(current => ({ ...current }));
  }

  validate() {
  }

  save() {
    this.validate();
    this.onSave.emit(this.getForm());
  }

  close() {
    this.saveDraft();
    this.stopAutoSave();
    this.onClose.emit(this.getForm());
  }

  ngOnDestroy(): void {
    this.stopAutoSave();
    this.autoSaveStop$.complete();
  }
}
