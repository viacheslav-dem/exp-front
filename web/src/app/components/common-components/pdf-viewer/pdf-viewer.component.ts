import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, effect, input} from "@angular/core";
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
        }
        `,
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.fileAndPdf)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default,
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
    `]
})
export class PdfViewerComponent implements OnInit, OnDestroy {

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

  constructor(private _storage: StorageService,
              private _http: HttpClientSecure,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    // Worker для PDF.js настроен глобально в main.ts
  }

  private loadPdf(doc: DocumentDto): void {
    this.cleanup();
    
    if (!doc || !doc.id) {
      console.error('Invalid document data:', doc);
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
          // В zoneless режиме setTimeout не триггерит change detection автоматически,
          // поэтому явно вызываем detectChanges() после обновления данных
          setTimeout(() => {
            this.pdfSrc = pdfData;
            this.cdr.detectChanges();  // Явная детекция изменений для zoneless режима
          }, 100);
        };
        reader.onerror = () => {
          console.error('Error reading PDF blob');
          this.pdfSrc = null;
          this.cdr.markForCheck();
        };
        reader.readAsArrayBuffer(blob);
      },
      error: (error) => {
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
    this.pdfSrc = null;
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}
