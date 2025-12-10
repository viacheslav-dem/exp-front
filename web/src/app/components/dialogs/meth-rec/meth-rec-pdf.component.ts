import {Component, EventEmitter, Output, input} from "@angular/core";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {StorageService} from "@app/services/storage.service";
import {SERVER_URL} from "@app/config";
import {DocumentDto} from "@app/dto/DocumentDto";
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";

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
          <iframe [src]="getFileUrl()" class="viewer" align="left" allowfullscreen>
            Ваш браузер не поддерживает плавающие фреймы!
          </iframe>
          <div class="text-sm">{{description()}}</div>
          <div class="mt-3">
            <button class="btn btn-primary mr-1" (click)="confirm()">{{okBtnMessage()}}</button>
            <button class="btn btn-dark" (click)="cancel()">{{cancelBtnMessage()}}</button>
          </div>
        </div>
        `,
    standalone: false
})
export class MethRecPdfComponent {

    readonly message = input<string>('Вы действительно хотите выполнить данную операцию?');
    readonly description = input<string>('Пожалуйста, перепроверьте данные, поскольку обратить действие будет невозможно.');
    readonly okBtnMessage = input<string>('Подтвердить');
    readonly cancelBtnMessage = input<string>('Отмена');
    readonly fields = input<ConfirmDialogField<any>[]>([]);

    @Output() onSave = new EventEmitter<any>();
    @Output() canceled = new EventEmitter();

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

    documentUrl: SafeResourceUrl;
    readonly url = input<string>('document');

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