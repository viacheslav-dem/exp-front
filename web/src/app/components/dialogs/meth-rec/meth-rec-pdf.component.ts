import {Component, EventEmitter, Output, input, OnDestroy, OnInit} from "@angular/core";
import {StorageService} from "@app/services/storage.service";
import {SERVER_URL} from "@app/config";
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";
import {HttpClientSecure} from "@app/services/http.client";
import {Subscription} from "rxjs";

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
          @if (pdfSrc) {
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
    `]
})
export class MethRecPdfComponent implements OnInit, OnDestroy {

    readonly message = input<string>('Вы действительно хотите выполнить данную операцию?');
    readonly description = input<string>('Пожалуйста, перепроверьте данные, поскольку обратить действие будет невозможно.');
    readonly okBtnMessage = input<string>('Подтвердить');
    readonly cancelBtnMessage = input<string>('Отмена');
    readonly fields = input<ConfirmDialogField<any>[]>([]);

    @Output() onSave = new EventEmitter<any>();
    @Output() canceled = new EventEmitter();

    pdfSrc: string | Uint8Array | ArrayBuffer;
    private subscription: Subscription;

    constructor(private _storage: StorageService,
                private _http: HttpClientSecure) {
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
        this.loadPdf();
    }

    confirm() {
        let result = {};
        const fieldsValue = this.fields();
        if (fieldsValue != null && Array.isArray(fieldsValue)) {
            fieldsValue.forEach(field => result[field.name] = field.value);
        }
        this.onSave.next(result);
    }

    cancel() {
        this.canceled.next(null);
    }

    private loadPdf(): void {
        const url = `${SERVER_URL}/document/get/meth_rec`;
        
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

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}