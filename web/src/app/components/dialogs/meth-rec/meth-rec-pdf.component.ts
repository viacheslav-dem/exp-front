import {Component, input, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, output} from "@angular/core";
import {StorageService} from "@app/services/storage.service";
import {SERVER_URL} from "@app/config";
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";
import {HttpClientSecure} from "@app/services/http.client";
import {Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-meth-rec-pdf',
    template: `
        <div>
          <div class="mb-2">{{message()}}</div>
          @for (field of (fields() ?? []); track field) {
            <div class="form-sub-group">
              <label>{{field.label}}</label>
              <input class="form-control" [type]="field.type" [(ngModel)]="field.value" required [name]="field.name"/>
            </div>
          }
          @if (isLoading) {
            <div class="text-center py-4">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Загрузка документа...
            </div>
          }
          @if (showPdfViewer) {
            <pdf-viewer 
                  [src]="pdfSrc" 
                  [render-text]="true"
                  [original-size]="false"
                  [show-all]="true"
                  [zoom]="1"
                  [zoom-scale]="'page-width'"
                  style="width: 100%; height: 60vh; display: block;"
                  class="pdf-viewer-container">
            </pdf-viewer>
          }
          @if (loadError) {
            <div class="alert alert-warning">Не удалось загрузить документ</div>
          }
          <div class="text-sm">{{description()}}</div>
          <div class="mt-3">
            <button class="btn btn-primary me-1" (click)="confirm()">{{okBtnMessage()}}</button>
            <button class="btn btn-dark" (click)="cancel()">{{cancelBtnMessage()}}</button>
          </div>
        </div>
        `,
    standalone: false,
    styles: [`
        .pdf-viewer-container {
            width: 100%;
            display: block;
        }
        ::ng-deep .pdf-viewer-container canvas {
            width: 100% !important;
            height: auto !important;
        }
    `],
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.dialogs)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class MethRecPdfComponent implements OnInit, OnDestroy {

    readonly message = input<string>('Вы действительно хотите выполнить данную операцию?');
    readonly description = input<string>('Пожалуйста, перепроверьте данные, поскольку обратить действие будет невозможно.');
    readonly okBtnMessage = input<string>('Подтвердить');
    readonly cancelBtnMessage = input<string>('Отмена');
    readonly fields = input<ConfirmDialogField<any>[]>([]);

    readonly onSave = output<any>();
    readonly canceled = output<void>();

    pdfSrc: string | Uint8Array | ArrayBuffer;
    private subscription: Subscription;
    isLoading = false;
    loadError = false;
    showPdfViewer = false;  // Флаг для показа/скрытия pdf-viewer
    private objectUrl: string = null;

    constructor(private _storage: StorageService,
                private _http: HttpClientSecure,
                private cdr: ChangeDetectorRef,
                private ngZone: NgZone) {
    }

    ngOnInit(): void {
        // Worker для PDF.js настроен глобально в main.ts
        
        // Сбрасываем предыдущее состояние и загружаем PDF
        this.cleanup();
        this.pdfSrc = null;
        this.loadPdf();
    }
    
    private cleanup(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        // Освобождаем Object URL для предотвращения утечки памяти
        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
            this.objectUrl = null;
        }
        this.isLoading = false;
        this.loadError = false;
        this.showPdfViewer = false;
    }

    confirm() {
        let result = {};
        const fieldsValue = this.fields();
        if (fieldsValue != null && Array.isArray(fieldsValue)) {
            fieldsValue.forEach(field => result[field.name] = field.value);
        }
        this.onSave.emit(result);
    }

    cancel() {
        this.canceled.emit(null);
    }

    private loadPdf(): void {
        // Предотвращаем повторную загрузку, если уже идёт
        if (this.isLoading) {
            return;
        }
        
        this.isLoading = true;
        this.loadError = false;
        // Сначала полностью скрываем pdf-viewer, чтобы Angular его уничтожил
        this.showPdfViewer = false;
        this.pdfSrc = null;
        this.cdr.detectChanges();  // Принудительное обновление DOM
        
        // Добавляем cache-busting параметр для предотвращения кэширования браузером
        const timestamp = Date.now();
        const url = `${SERVER_URL}/document/get/meth_rec?_t=${timestamp}`;
        
        this.subscription = this._http.getBlock<Blob>(url, {
            responseType: 'blob'
        }).subscribe(
            (blob: Blob) => {
                // Конвертируем Blob в Uint8Array
                const reader = new FileReader();
                reader.onload = () => {
                    this.ngZone.run(() => {
                        const arrayBuffer = reader.result as ArrayBuffer;
                        const pdfData = new Uint8Array(arrayBuffer);
                        
                        // Даём время Angular полностью удалить старый pdf-viewer из DOM
                        setTimeout(() => {
                            this.pdfSrc = pdfData;
                            this.isLoading = false;
                            this.showPdfViewer = true;
                            this.cdr.detectChanges();
                        }, 100);
                    });
                };
                reader.onerror = () => {
                    this.ngZone.run(() => {
                        this.pdfSrc = null;
                        this.isLoading = false;
                        this.loadError = true;
                        this.cdr.detectChanges();
                    });
                };
                reader.readAsArrayBuffer(blob);
            },
            () => {
                this.ngZone.run(() => {
                    this.pdfSrc = null;
                    this.isLoading = false;
                    this.loadError = true;
                    this.cdr.detectChanges();
                });
            }
        );
    }

    ngOnDestroy(): void {
        this.cleanup();
    }
}