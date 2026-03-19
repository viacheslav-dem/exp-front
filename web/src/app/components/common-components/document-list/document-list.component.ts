import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, computed, input, output, viewChild} from '@angular/core';
import {FileEditorComponent} from "../file-editor/file-editor.component";
import {DocumentService} from "@app/services/document.service";
import {DocumentDto} from "@app/dto/DocumentDto";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";
import {EsifulService} from "@app/services/esiful.service";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-document-list',
    templateUrl: './document-list.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.fileAndPdf)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class DocumentListComponent implements OnInit, OnDestroy {

  public selectedDocument: any = null;
  readonly canDelete = input<boolean>(false);
  readonly canUpdate = input<boolean>(false);
  readonly canCheck = input<boolean>(false);
  readonly url = input<string>('document');
  readonly onUpdate = output<DocumentDto>();
  readonly onDelete = output<any>();
  readonly fileEditor = viewChild(FileEditorComponent);
  readonly fileViewerModal = viewChild<ModalComponent>("fileViewerModal");
  private subscriptions: Subscription[] = [];

  constructor(private _documentService: DocumentService,
              private _toasty: GlobalToastyService,
              private _dialogService: DialogService,
              private cdr: ChangeDetectorRef,
              private esifulService: EsifulService,
              private datePipe: DatePipe
              ) {
  }

  ngOnInit() {
  }

  readonly documents = input<any[] | any>(undefined);

  readonly documentsForTemplate = computed(() => {
    const documents = this.documents();
    if (documents == null) {
      return [];
    }
    if (documents instanceof Array) {
      return documents.filter(d => d);
    }
    return [documents];
  });

  viewDocument(doc) {
    this.subscriptions.push(
      this._documentService.checkPdfView(doc).subscribe(res => {
        if (!res) {
          this._toasty.warn("Формат файла не поддерживается для предпросмотра. " +
            "Вместо этого, пожалуйста, скачайте его и откройте у себя на компьютере предустановленной программой");
        } else {
          this.subscriptions.push(
            this._dialogService.showPDFViewer("document", doc).subscribe()
          );
        }
        // Для OnPush/zoneless: обновления/модалки инициируются из async-подписки
        this.cdr.markForCheck();
      })
    );
  }

  checkSignature(doc) {
    console.log(doc);
    this.esifulService.checkSignature(doc).subscribe(res => {
      console.log(res.holistic);
      if(res.holistic){
        let message = "";
        res.signingUserinfoDtos.forEach(r => {
          const formattedDate = this.datePipe.transform(r.signingDate, 'dd.MM.yyyy HH:mm');

          message = message.concat(`${r.userinfoDto.surname} ${r.userinfoDto.name} ${formattedDate}<br>`);
        });
        this._dialogService.showConfirmDialog('Подтверждение ЭЦП',
            `${res.message} <br> Подписал: <br> ${message}`, null, "ОК", "Отмена");
      } else {
        this._dialogService.showConfirmDialog('Подтверждение ЭЦП',
            `${res.message}`, null, "ОК", "Отмена");
      }
    });
  }


  editDocument(doc) {
    this.selectedDocument = doc;
    this.fileEditor()?.show();
  }

  updateDocument(doc: DocumentDto) {
    this.onUpdate.emit(doc);
  }

  hideEditor() {
    this.fileEditor()?.hide();
  }

  downloadDocument(doc: DocumentDto) {
    this.subscriptions.push(
      this._documentService.downloadDocument(doc, this.url()).subscribe()
    );
  }

  deleteDocument(doc) {
    this.onDelete.emit(doc);
  }

  downloadDocxDocument(doc: DocumentDto) {
    this.subscriptions.push(
      this._documentService.downloadDocument(doc, this.url() + '/docx').subscribe()
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}
