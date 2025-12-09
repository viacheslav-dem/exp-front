import {Component, EventEmitter, Input, Output} from "@angular/core";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {StorageService} from "@app/services/storage.service";
import {SERVER_URL} from "@app/config";
import {DocumentDto} from "@app/dto/DocumentDto";
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";

@Component({
    selector: 'app-meth-rec-pdf',
    template: `
        <div>
            <div class="mb-2">{{message}}</div>
            <div class="form-sub-group" *ngFor="let field of fields">
                <label>{{field.label}}</label>
                <input class="form-control" [type]="field.type" [(ngModel)]="field.value" required [name]="field.name"/>
            </div>
            <iframe [src]="getFileUrl()" class="viewer" align="left" allowfullscreen>
                Ваш браузер не поддерживает плавающие фреймы!
            </iframe>
            <div class="text-sm">{{description}}</div>
            <div class="mt-3">
                <button class="btn btn-primary mr-1" (click)="confirm()">{{okBtnMessage}}</button>
                <button class="btn btn-dark" (click)="cancel()">{{cancelBtnMessage}}</button>
            </div>
        </div>
  `
})
export class MethRecPdfComponent {

    @Input() message: string = 'Вы действительно хотите выполнить данную операцию?';
    @Input() description: string = 'Пожалуйста, перепроверьте данные, поскольку обратить действие будет невозможно.';
    @Input() okBtnMessage: string = 'Подтвердить';
    @Input() cancelBtnMessage: string = 'Отмена';
    @Input() fields: ConfirmDialogField<any>[] = [];

    @Output() onSave = new EventEmitter<any>();
    @Output() canceled = new EventEmitter();

    confirm() {
        let result = {};
        if (this.fields != null)
            this.fields.forEach(field => result[field.name] = field.value);
        this.onSave.next(result);
    }

    cancel() {
        this.canceled.next(null);
    }

    documentUrl: SafeResourceUrl;
    @Input() url: string = 'document';

    constructor(private sanitizer: DomSanitizer,
                private _storage: StorageService) {
    }

    // @Input() set doc(doc: DocumentDto) {
    //     this.documentUrl = doc ? this.sanitizer.bypassSecurityTrustResourceUrl(this.getFileUrl(doc)) : null;
    // }

    public getFileUrl() {
        //
        // let filename = encodeURIComponent(doc.name + '.pdf');
        // let args = `token=${this._storage.getAccessToken()}&convert=true&id=${doc.id}&filename=${filename}`;
        let serverUrl = `${SERVER_URL}/document/get/meth_rec`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            `${location.origin}${location.pathname}/assets/pdfjs/web/viewer.html?file=${encodeURIComponent(serverUrl)}`);
    }
}