import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnDestroy, OnInit, effect, inject, input} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {timer} from 'rxjs';
import {StorageService} from "app/services/storage.service";
import {SERVER_URL} from "app/config";
import {DocumentDto} from "@app/dto/DocumentDto";
import {HttpClientSecure} from "@app/services/http.client";
import {Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-pdf-viewer',
    template: `
        @if (pdfSrc) {
            <pdf-viewer 
                [src]="pdfSrc" 
                [render-text]="true"
                [original-size]="false"
                [show-all]="true"
                [zoom]="1"
                [zoom-scale]="'page-width'"
                style="width: 100%; height: 80vh; display: block;"
                class="pdf-viewer-container">
            </pdf-viewer>
        } @else if (isArchivePlaceholder()) {
            <div class="pdf-viewer-placeholder text-muted text-center py-5 px-3">
                <p class="mb-0">Просмотр архива в браузере недоступен.</p>
                <p class="mb-0 small">Скачайте файл по кнопке «Скачать» в списке документов.</p>
            </div>
        }
        `,
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.fileAndPdf)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager,
    styles: [`
        .pdf-viewer-container {
            width: 100%;
            height: 80vh;
            display: block;
        }
        ::ng-deep .pdf-viewer-container canvas {
            width: 100% !important;
            height: auto !important;
        }
        .pdf-viewer-placeholder {
            min-height: 120px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    `]
})
export class PdfViewerComponent implements OnInit, OnDestroy {

  private readonly destroyRef = inject(DestroyRef);
  pdfSrc: string | Uint8Array | ArrayBuffer;
  readonly url = input<string>('document');
  readonly doc = input<DocumentDto | undefined>(undefined);
  private readonly _docEffect = effect(() => {
    const doc = this.doc();
    if (doc) {
      this.loadPdf(doc);
      return;
    }
    this.cleanup();
    this.pdfSrc = null;
    this.cdr.markForCheck();
  });
  private subscription: Subscription;
  private timerSub: Subscription | null = null;

  constructor(private _storage: StorageService,
              private _http: HttpClientSecure,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    // Worker для PDF.js настроен глобально в main.ts
  }

  /** Показывать блок «просмотр архива недоступен» (ZIP не конвертируется в PDF). */
  isArchivePlaceholder(): boolean {
    return !!this.doc()?.archive && !this.pdfSrc;
  }

  private loadPdf(doc: DocumentDto): void {
    this.cleanup();

    if (!doc || !doc.id) {
      console.error('Invalid document data:', doc);
      this.pdfSrc = null;
      this.cdr.markForCheck();
      return;
    }

    // Архив (ZIP) конвертировать в PDF на бэкенде нельзя — не дергаем API, не показываем ошибку
    if (doc.archive) {
      this.pdfSrc = null;
      this.cdr.markForCheck();
      return;
    }

    // Сбрасываем pdfSrc перед загрузкой нового
    this.pdfSrc = null;
    this.cdr.markForCheck();
    
    let filename = encodeURIComponent(doc.name + '.pdf');
    let url = `${SERVER_URL}/${this.url()}?convert=true&id=${doc.id}&filename=${filename}`;
    
    // Загружаем PDF через HttpClient с авторизацией
    this.subscription = this._http.getBlock<Blob>(url, {
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        // Используем FileReader для конвертации Blob в ArrayBuffer
        // Без Zone.js: явно вызываем detectChanges() после асинхронных операций
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          const pdfData = new Uint8Array(arrayBuffer);
          
          // Даём время Angular полностью обработать предыдущее состояние
          // В zoneless режиме timer не триггерит change detection автоматически,
          // поэтому явно вызываем detectChanges() после обновления данных
          this.timerSub = timer(100).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.timerSub = null;
            this.pdfSrc = pdfData;
            this.cdr.detectChanges();  // Явная детекция изменений для zoneless режима
          });
        };
        reader.onerror = () => {
          console.error('Error reading PDF blob');
          this.pdfSrc = null;
          this.cdr.markForCheck();
        };
        reader.readAsArrayBuffer(blob);
      },
      error: (error) => {
        if (error?.status === 400) {
          this.pdfSrc = null;
          this.cdr.markForCheck();
          return;
        }
        console.error('Error loading PDF:', error);
        this.pdfSrc = null;
        this.cdr.markForCheck();
      }
    });
  }

  private cleanup(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    if (this.timerSub) {
      this.timerSub.unsubscribe();
      this.timerSub = null;
    }
    this.pdfSrc = null;
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}
