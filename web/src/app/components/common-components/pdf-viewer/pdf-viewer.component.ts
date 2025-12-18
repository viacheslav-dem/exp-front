import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
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
  @Input() url: string = 'document';
  private subscription: Subscription;

  constructor(private _storage: StorageService,
              private _http: HttpClientSecure,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    // Настройка worker для PDF.js
    // ng2-pdf-viewer загружает pdfjs-dist, но мы можем настроить worker заранее
    if (typeof window !== 'undefined') {
      // Пытаемся настроить worker через глобальный объект
      const setupWorker = () => {
        try {
          // Проверяем различные возможные пути к pdfjs-dist
          const pdfjs = (window as any)['pdfjs-dist'] 
            || (window as any)['pdfjs-dist/build/pdf']
            || (window as any).pdfjsLib;
          
          if (pdfjs && pdfjs.GlobalWorkerOptions) {
            pdfjs.GlobalWorkerOptions.workerSrc = './assets/pdfjs/build/pdf.worker.js';
            return true;
          }
        } catch (e) {
          // Игнорируем ошибку
        }
        return false;
      };
      
      // Пытаемся настроить сразу
      if (!setupWorker()) {
        // Если не получилось, пробуем позже (ng2-pdf-viewer может еще не загрузить pdfjs-dist)
        setTimeout(setupWorker, 100);
        setTimeout(setupWorker, 500);
      }
    }
  }

  @Input() set doc(doc: DocumentDto) {
    if (doc) {
      this.loadPdf(doc);
    } else {
      this.cleanup();
      this.pdfSrc = null;
      this.cdr.markForCheck();
    }
  }

  private loadPdf(doc: DocumentDto): void {
    this.cleanup();
    
    if (!doc || !doc.id) {
      console.error('Invalid document data:', doc);
      this.pdfSrc = null;
      this.cdr.markForCheck();
      return;
    }
    
    let filename = encodeURIComponent(doc.name + '.pdf');
    let url = `${SERVER_URL}/${this.url}?convert=true&id=${doc.id}&filename=${filename}`;
    
    // Загружаем PDF через HttpClient с авторизацией
    this.subscription = this._http.getBlock<Blob>(url, {
      responseType: 'blob'
    }).subscribe(
      (blob: Blob) => {
        // Конвертируем Blob в ArrayBuffer для ng2-pdf-viewer
        blob.arrayBuffer().then(buffer => {
          this.pdfSrc = new Uint8Array(buffer);
          // Promise-resolve может происходить вне зоны
          this.cdr.markForCheck();
        });
      },
      (error) => {
        console.error('Error loading PDF:', error);
        this.pdfSrc = null;
        this.cdr.markForCheck();
      }
    );
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
