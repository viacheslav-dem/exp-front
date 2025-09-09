import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {PersonDto} from "@app/dto/PersonDto";
import {DialogResult} from "@app/components/dialogs/dialog-result";
import {DialogContainer, DialogType} from "@app/components/dialogs/dialog-container";
import {ConfirmDialog} from "@app/components/dialogs/confirm-dialog/ConfirmDialog";
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";
import {DocumentDto} from "@app/dto/DocumentDto";
import {MethRecDialog} from "@app/components/dialogs/meth-rec/MethRecDialog";

@Injectable()
export class DialogService {

  dialogSubject$ = new Subject<DialogContainer<any>>();
  onOpenDialog: Observable<DialogContainer<any>>;

  constructor() {
    this.onOpenDialog = this.dialogSubject$.asObservable();
  }

  showUserDialog(user: PersonDto, current: boolean): Observable<DialogResult<PersonDto>> {
    let dialogCloseSubject$ = new Subject<DialogResult<PersonDto>>();
    user.current = current;
    this.dialogSubject$.next(new DialogContainer<PersonDto>(DialogType.USER, user,
      dialogCloseSubject$, false));
    return dialogCloseSubject$.asObservable();
  }

  showChangePasswordDialog(userId: number): Observable<DialogResult<number>> {
    let dialogCloseSubject$ = new Subject<DialogResult<number>>();
    this.dialogSubject$.next(new DialogContainer<number>(DialogType.PASSWORD, userId, dialogCloseSubject$));
    return dialogCloseSubject$.asObservable();
  }

  showConfirmDialogWithFields(fields: ConfirmDialogField<any>[],
                              title: string = 'Подтверждение действия',
                              message: string = 'Вы действительно хотите выполнить данную операцию?',
                              description: string = 'Пожалуйста, перепроверьте данные, поскольку обратить действие будет невозможно.',
                              okBtnMessage: string = 'Подтвердить',
                              cancelBtnMessage: string = 'Отмена'): Observable<DialogResult<ConfirmDialog>> {
    return this.showConfirmDialog(title, message, description, okBtnMessage, cancelBtnMessage, fields);

  }

  showConfirmDialog(title: string = 'Подтверждение действия',
                    message: string = 'Вы действительно хотите выполнить данную операцию?',
                    description: string = 'Пожалуйста, перепроверьте данные, поскольку обратить действие будет невозможно.',
                    okBtnMessage: string = 'Подтвердить',
                    cancelBtnMessage: string = 'Отмена',
                    fields?: ConfirmDialogField<any>[]): Observable<DialogResult<ConfirmDialog>> {
    let confirmData = new ConfirmDialog(title, message, description, okBtnMessage, cancelBtnMessage, fields);
    let dialogCloseSubject$ = new Subject<DialogResult<ConfirmDialog>>();
    this.dialogSubject$.next(new DialogContainer<ConfirmDialog>(DialogType.CONFIRM, confirmData, dialogCloseSubject$));
    return dialogCloseSubject$.asObservable();
  }

  showPDFViewer(url: string, doc: DocumentDto) {
    let dialogCloseSubject$ = new Subject<DialogResult<FileInfo>>();
    let info: FileInfo = {url: url, doc: doc, title: doc.name};
    this.dialogSubject$.next(new DialogContainer<FileInfo>(DialogType.VIEWER, info, dialogCloseSubject$));
    return dialogCloseSubject$.asObservable();
  }

  showMethRecPDF(title: string = 'Подтверждение действия',
                 message: string = 'Вы действительно хотите выполнить данную операцию?',
                 description: string = 'Пожалуйста, перепроверьте данные, поскольку обратить действие будет невозможно.',
                 okBtnMessage: string = 'Подтвердить',
                 cancelBtnMessage: string = 'Отмена',
                 fields?: ConfirmDialogField<any>[]): Observable<DialogResult<ConfirmDialog>> {
    let methRec = new MethRecDialog(title, message, description, okBtnMessage, cancelBtnMessage, fields);
    let dialogCloseSubject$ = new Subject<DialogResult<ConfirmDialog>>();
    this.dialogSubject$.next(new DialogContainer<ConfirmDialog>(DialogType.METH_REC, methRec, dialogCloseSubject$));
    return dialogCloseSubject$.asObservable();
  }

}


export class FileInfo {
  url: string;
  doc: DocumentDto;
  title: string;
}