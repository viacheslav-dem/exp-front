import {ChangeDetectionStrategy, Component, viewChild, signal, computed, effect, DestroyRef, inject, untracked} from '@angular/core';
import {toSignal, takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {timer} from 'rxjs';
import {DialogService} from "@app/components/dialogs/dialog.service";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {DialogResult} from "@app/components/dialogs/dialog-result";
import {DialogContainer, DialogType} from "@app/components/dialogs/dialog-container";
import {UserFormComponent} from "@app/components/dialogs/user-form/user-form.component";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-dialogs',
    templateUrl: './dialog.component.html',
    styles: [],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.dialogs)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class DialogComponent {

  DialogType = DialogType;
  
  readonly dlg = signal<DialogContainer<any> | null>(null);
  readonly data = computed(() => this.dlg()?.data ?? null);
  readonly title = computed(() => {
    const currentDlg = this.dlg();
    if (!currentDlg) return '';
    const data = currentDlg.data;
    return data?.title ? data.title : this.titleMap[currentDlg.type];
  });
  
  private readonly titleMap: Record<DialogType, string> = {
    [DialogType.USER]: 'Редактирование пользователя',
    [DialogType.PASSWORD]: 'Смена пароля',
    [DialogType.CONFIRM]: 'Подтверждение действия',
    [DialogType.VIEWER]: '',
    [DialogType.METH_REC]: ''
  };

  readonly modalComponent = viewChild<ModalComponent>('modalComponent');
  readonly userForm = viewChild(UserFormComponent);

  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);
  private _openSeq = 0; // Токен для отмены устаревших операций открытия

  private readonly dialogStream = toSignal(
    this.dialogService.onOpenDialog.pipe(takeUntilDestroyed(this.destroyRef)),
    { initialValue: undefined }
  );

  constructor() {
    effect(() => {
      const newDlg = this.dialogStream();
      if (newDlg === undefined) return;

      // КРИТИЧНО: effect должен зависеть ТОЛЬКО от dialogStream().
      // Чтения dlg()/modalComponent() только через untracked(), иначе возможен цикл.
      const currentDlg = untracked(() => this.dlg());
      const seq = ++this._openSeq;

      if (currentDlg != null) {
        currentDlg.callback.complete();
      }

      untracked(() => this.dlg.set(null));

      queueMicrotask(() => {
        if (seq !== this._openSeq) return;
        untracked(() => this.dlg.set(newDlg));

        timer(0).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          if (seq !== this._openSeq) return;
          if (untracked(() => this.dlg()) === newDlg) {
            untracked(() => this.modalComponent()?.show());
          }
        });
      });
    });
  }

  save(entity?: any) {
    const currentDlg = this.dlg();
    if (!currentDlg) return;
    
    currentDlg.callback.next(new DialogResult(entity, this));
    if (currentDlg.autoClose) {
      this.forceClose();
    }
  }

  cancel() {
    this.forceClose();
  }

  check(): boolean {
    const form = this.userForm();
    if (form == null)
      return true;
    else
      return form.checkModification();
  }

  close() {
    this.forceClose();
  }

  forceClose() {
    this._openSeq++;
    this.modalComponent()?.hide();
    const currentDlg = this.dlg();
    if (currentDlg) {
      currentDlg.callback.complete();
    }
    this.dlg.set(null);
  }
}
