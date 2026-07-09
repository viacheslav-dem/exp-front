import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject,
    NgZone,
    OnDestroy,
    OnInit
} from "@angular/core";
import {Subscription, timer} from "rxjs";
import {SERVER_URL} from "@app/config";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {HttpClientSecure} from "@app/services/http.client";
import {environment} from "../../../environments/environment";
import {PdfViewerModule} from "ng2-pdf-viewer";


@Component({
    selector: 'app-methodical-recommendations',
    template: `
        <div>
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
        </div>
    `,
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
    imports: [
        PdfViewerModule
    ],
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.dialogs)
        ? ChangeDetectionStrategy.OnPush
        : ChangeDetectionStrategy.Eager
})
export class MethodicalRecommendationsComponent implements OnInit, OnDestroy{

    private readonly destroyRef = inject(DestroyRef);
    pdfSrc: string | Uint8Array | ArrayBuffer;
    private subscription: Subscription;
    isLoading = false;
    loadError = false;
    showPdfViewer = false;  // Флаг для показа/скрытия pdf-viewer
    private objectUrl: string = null;

    ngOnInit(): void {
        this.cleanup();
        this.pdfSrc = null;
        this.loadPdf();
    }

    constructor(private _http: HttpClientSecure,
                private cdr: ChangeDetectorRef,
                private ngZone: NgZone) {
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
                        timer(100).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                            this.pdfSrc = pdfData;
                            this.isLoading = false;
                            this.showPdfViewer = true;
                            this.cdr.detectChanges();
                        });
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

    ngOnDestroy(): void {
        this.cleanup();
    }

}