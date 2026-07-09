import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, computed, inject, input, output, viewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FileEditorComponent} from "../file-editor/file-editor.component";
import {DocumentService} from "@app/services/document.service";
import {DocumentDto} from "@app/dto/DocumentDto";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {filter, switchMap, tap} from "rxjs";
import {environment} from "../../../../environments/environment";
import {EsifulService} from "@app/services/esiful.service";
import {VerifiedDocumentDto} from "@app/dto/VerifiedDocumentDto";
import {SigningUserinfoDto} from "@app/dto/SigningUserinfoDto";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-document-list',
    templateUrl: './document-list.component.html',
    styleUrls: ['./document-list.component.scss'],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.fileAndPdf)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class DocumentListComponent {

  public selectedDocument: DocumentDto | null = null;
  readonly canDelete = input<boolean>(false);
  readonly canUpdate = input<boolean>(false);
  readonly canCheck = input<boolean>(false);
  readonly url = input<string>('document');
  readonly onUpdate = output<DocumentDto>();
  readonly onDelete = output<DocumentDto>();
  readonly fileEditor = viewChild(FileEditorComponent);
  readonly fileViewerModal = viewChild<ModalComponent>("fileViewerModal");

  private readonly destroyRef = inject(DestroyRef);

  constructor(private _documentService: DocumentService,
              private _toasty: GlobalToastyService,
              private _dialogService: DialogService,
              private cdr: ChangeDetectorRef,
              private esifulService: EsifulService,
              private datePipe: DatePipe
              ) {
  }

  readonly documents = input<DocumentDto[] | DocumentDto | undefined>(undefined);

  readonly documentsForTemplate = computed<DocumentDto[]>(() => {
    const documents = this.documents();
    if (documents == null) {
      return [];
    }
    if (documents instanceof Array) {
      return documents.filter(d => d);
    }
    return [documents];
  });

  viewDocument(doc: DocumentDto) {
    this._documentService.checkPdfView(doc).pipe(
      tap(res => {
        if (!res) {
          this._toasty.warn("Формат файла не поддерживается для предпросмотра. " +
            "Вместо этого, пожалуйста, скачайте его и откройте у себя на компьютере предустановленной программой");
        }
        // Для OnPush/zoneless: обновления/модалки инициируются из async-подписки
        this.cdr.markForCheck();
      }),
      filter(res => !!res),
      switchMap(() => this._dialogService.showPDFViewer("document", doc)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  /** Экранирование динамических данных перед вставкой в innerHTML. */
  private escapeHtml(value: unknown): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  checkSignature(doc: DocumentDto) {
    this.esifulService.checkSignature(doc)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: VerifiedDocumentDto) => {
          if (res.holistic) {
            this.showSignatureInfoDialog(res);
          } else {
            this.showNoSignatureDialog(res);
          }
        },
        error: (error) => {
          console.error('Ошибка при проверке подписи:', error);
          this._toasty.error('Произошла ошибка при проверке электронной подписи');
        }
      });
  }

  private showSignatureInfoDialog(res: VerifiedDocumentDto): void {
    const signers: SigningUserinfoDto[] = res.signingUserinfoDtos ?? [];

    const signersHtml = signers.map((r) => {
      const formattedDate = this.escapeHtml(this.datePipe.transform(r.signingDate, 'dd.MM.yyyy HH:mm'));
      const fullName = this.escapeHtml(`${r.userinfoDto.surname} ${r.userinfoDto.name} ${r.userinfoDto.patronymic || ''}`.trim());
      return `
        <div class="eds__signer">
          <span class="eds__icon eds__icon--check-soft eds__icon--sm"></span>
          <div>
            <div class="eds__signer-name">${fullName}</div>
            <div class="eds__signer-date">Подписано ${formattedDate}</div>
          </div>
        </div>`;
    }).join('');

    const messageHtml = `
      <div class="eds">
        <div class="eds__banner eds__banner--ok">
          <span class="eds__icon eds__icon--check"></span>
          <div>
            <div class="eds__banner-title">${this.escapeHtml(res.message)}</div>
            <div class="eds__banner-subtitle">Документ подписан электронной цифровой подписью</div>
          </div>
        </div>

        <div class="eds__section-label">Подписанты · ${signers.length}</div>
        <div class="eds__signers">${signersHtml}</div>

        ${signers.length > 0 ? `
          <div class="eds__note">Все подписи действительны и соответствуют требованиям</div>
        ` : ''}
      </div>`;

    this._dialogService.showConfirmDialog(
        'Подтверждение ЭЦП',
        messageHtml,
        'Проверка электронной цифровой подписи прошла успешно',
        'Закрыть',
        ''
    );
  }

  private showNoSignatureDialog(res: VerifiedDocumentDto): void {
    const messageHtml = `
      <div class="eds">
        <div class="eds__banner eds__banner--error">
          <span class="eds__icon eds__icon--warn"></span>
          <div>
            <div class="eds__banner-title">${this.escapeHtml(res.message)}</div>
            <div class="eds__banner-subtitle">Документ не подписан электронной цифровой подписью</div>
          </div>
        </div>

        <div class="eds__note">Для подписания документа обратитесь к ответственному лицу</div>
      </div>`;

    this._dialogService.showConfirmDialog(
        'Подтверждение ЭЦП',
        messageHtml,
        'Электронная подпись отсутствует',
        'Закрыть',
        ''
    );
  }


  editDocument(doc: DocumentDto) {
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
    this._documentService.downloadDocument(doc, this.url())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  deleteDocument(doc: DocumentDto) {
    this.onDelete.emit(doc);
  }

  downloadDocxDocument(doc: DocumentDto) {
    this._documentService.downloadDocument(doc, this.url() + '/docx')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
