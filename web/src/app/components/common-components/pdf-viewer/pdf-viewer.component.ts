import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {StorageService} from "app/services/storage.service";
import {SERVER_URL} from "app/config";
import {DocumentDto} from "@app/dto/DocumentDto";
import {HttpClientSecure} from "@app/services/http.client";
import {Subscription} from "rxjs";

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
              private _http: HttpClientSecure) {
  }

  ngOnInit(): void {
    // Настройка worker для PDF.js (ng2-pdf-viewer использует pdfjs-dist)
    if (typeof window !== 'undefined') {
      import('pdfjs-dist').then((pdfjsLib) => {
        try {
          // Используем локальный worker файл
          pdfjsLib.GlobalWorkerOptions.workerSrc = './assets/pdf.worker.min.mjs';
        } catch (e) {
          // Если не удалось установить, используем CDN
          console.warn('Could not set local PDF.js worker, using CDN:', e);
          try {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
          } catch (e2) {
            console.error('Could not set PDF.js worker:', e2);
          }
        }
      }).catch((err) => {
        console.warn('Could not load pdfjs-dist:', err);
      });
    }
  }

  @Input() set doc(doc: DocumentDto) {
    if (doc) {
      this.loadPdf(doc);
    } else {
      this.cleanup();
      this.pdfSrc = null;
    }
  }

  private loadPdf(doc: DocumentDto): void {
    this.cleanup();
    
    if (!doc || !doc.id) {
      console.error('Invalid document data:', doc);
      this.pdfSrc = null;
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
        });
      },
      (error) => {
        console.error('Error loading PDF:', error);
        this.pdfSrc = null;
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
