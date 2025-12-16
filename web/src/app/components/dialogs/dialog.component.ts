import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DialogService} from "@app/components/dialogs/dialog.service";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {DialogResult} from "@app/components/dialogs/dialog-result";
import {DialogContainer, DialogType} from "@app/components/dialogs/dialog-container";
import {UserFormComponent} from "@app/components/dialogs/user-form/user-form.component";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {Subscription} from "rxjs";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-dialogs',
    templateUrl: './dialog.component.html',
    styles: [],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: environment.features.onPush.dialogs ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class DialogComponent implements OnInit, OnDestroy {

  DialogType = DialogType;
  dlg: DialogContainer<any>;
  data: any;
  title: string;
  titleMap = {};
  private subscription: Subscription;

  @ViewChild('modalComponent', { static: false }) public modalComponent: ModalComponent;
  @ViewChild(UserFormComponent, { static: false }) userForm: UserFormComponent;

  constructor(
    private dialogService: DialogService,
    private toastService: GlobalToastyService,
    private cdr: ChangeDetectorRef
  ) {
    this.titleMap[DialogType.USER] = 'Редактирование пользователя';
    this.titleMap[DialogType.PASSWORD] = 'Смена пароля';
    this.titleMap[DialogType.CONFIRM] = 'Подтверждение действия';
  }

  ngOnInit() {
    this.subscription = this.dialogService.onOpenDialog.subscribe(dlg => {
      if (this.dlg != null) {
        this.cancel(); // close current dialog
      }
      setTimeout(() => {
        // open new dialog
        this.dlg = dlg;
        this.data = dlg.data;
        this.title = dlg.data.title ? dlg.data.title : this.titleMap[this.dlg.type];
        this.modalComponent.show();
        // Важно для OnPush/zoneless: обновление пришло из подписки + открытие модалки
        this.cdr.markForCheck();
      });
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  save(entity?: any) {
    this.dlg.callback.next(new DialogResult(entity, this));
    if (this.dlg.autoClose) {
      this.forceClose();
    }
  }

  cancel() {
    this.forceClose();
  }

  check(): boolean {
    if (this.userForm == null)
      return true;
    else
      return this.userForm.checkModification();
  }

  close() {
    // if (!this.check()) {
    //   this.toastService.warn('Данные были изменены, нажмите кнопку "Отмена" для выхода без сохранения данных или "Сохранить"')
    // } else {
      this.forceClose();
    // }
  }

  forceClose() {
    this.modalComponent.hide();
    this.dlg.callback.complete();
    this.dlg = null;
    this.cdr.markForCheck();
  }
}
