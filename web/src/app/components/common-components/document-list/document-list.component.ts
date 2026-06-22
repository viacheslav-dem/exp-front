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
    styleUrls: ['./document-list.component.scss'],
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
    console.log('📄 Проверка подписи для документа:', doc);

    this.esifulService.checkSignature(doc).subscribe({
      next: (res) => {
        console.log('✅ Результат проверки:', res);

        if (res.holistic) {
          // Подпись найдена - показываем красивую информацию
          this.showSignatureInfoDialog(res);
        } else {
          // Подпись не найдена
          this.showNoSignatureDialog(res);
        }
      },
      error: (error) => {
        console.error('❌ Ошибка при проверке подписи:', error);
        this._toasty.error('Произошла ошибка при проверке электронной подписи');
      }
    });
  }

  private showSignatureInfoDialog(res: any): void {
    // Формируем список подписантов с красивым форматированием
    let signersHtml = '';
    let signerCount = 0;

    res.signingUserinfoDtos.forEach((r, index) => {
      const formattedDate = this.datePipe.transform(r.signingDate, 'dd.MM.yyyy HH:mm');
      const fullName = `${r.userinfoDto.surname} ${r.userinfoDto.name} ${r.userinfoDto.patronymic || ''}`.trim();

      // Иконка для каждого подписанта
      const icon = '✅';
      signerCount++;

      signersHtml += `
            <div style="padding: 8px 12px; margin: 4px 0; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #28a745;">
                <strong>${icon} ${fullName}</strong>
                <span style="color: #6c757d; font-size: 0.9rem; margin-left: 8px;">
                    📅 ${formattedDate}
                </span>
            </div>
        `;
    });

    // Создаем HTML для отображения
    const messageHtml = `
        <div style="font-size: 1rem; line-height: 1.6;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; padding: 12px; background: #d4edda; border-radius: 8px; border: 1px solid #c3e6cb;">
                <span style="font-size: 2rem;">✅</span>
                <div>
                    <strong style="color: #155724; font-size: 1.1rem;">${res.message}</strong>
                    <div style="color: #155724; font-size: 0.9rem; margin-top: 4px;">
                        Документ подписан электронной цифровой подписью
                    </div>
                </div>
            </div>
            
            <div style="margin: 16px 0 8px 0; font-weight: 600; color: #495057; font-size: 1rem;">
                📝 Подписанты (${signerCount}):
            </div>
            <div style="margin: 8px 0 0 0; max-height: 300px; overflow-y: auto;">
                ${signersHtml}
            </div>
            
            ${res.signingUserinfoDtos.length > 0 ? `
                <div style="margin-top: 12px; padding: 8px 12px; background: #e7f3ff; border-radius: 6px; font-size: 0.9rem; color: #004085; border: 1px solid #b8daff;">
                    ℹ️ Все подписи действительны и соответствуют требованиям
                </div>
            ` : ''}
        </div>
    `;

    this._dialogService.showConfirmDialog(
        '✅ Подтверждение ЭЦП',
        messageHtml,
        'Проверка электронной цифровой подписи прошла успешно',
        '🆗 Закрыть',
        ''
    );
  }

  private showNoSignatureDialog(res: any): void {
    const messageHtml = `
        <div style="font-size: 1rem; line-height: 1.6;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; padding: 12px; background: #f8d7da; border-radius: 8px; border: 1px solid #f5c6cb;">
                <span style="font-size: 2rem;">⚠️</span>
                <div>
                    <strong style="color: #721c24; font-size: 1.1rem;">${res.message}</strong>
                    <div style="color: #721c24; font-size: 0.9rem; margin-top: 4px;">
                        Документ не подписан электронной цифровой подписью
                    </div>
                </div>
            </div>
            
            <div style="padding: 12px; background: #fff3cd; border-radius: 6px; border: 1px solid #ffeeba; color: #856404;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2rem;">💡</span>
                    <span>Для подписания документа обратитесь к ответственному лицу</span>
                </div>
            </div>
        </div>
    `;

    this._dialogService.showConfirmDialog(
        '⚠️ Подтверждение ЭЦП',
        messageHtml,
        'Электронная подпись отсутствует',
        '🆗 Закрыть',
        ''
    );
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
