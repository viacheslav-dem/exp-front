import {Component, Input} from "@angular/core";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {StorageService} from "app/services/storage.service";
import {SERVER_URL} from "app/config";
import {DocumentDto} from "@app/dto/DocumentDto";


@Component({
  selector: 'app-pdf-viewer',
  template: `<iframe *ngIf="documentUrl" [src]="documentUrl" class="viewer" align="left" allowfullscreen>
      Ваш браузер не поддерживает плавающие фреймы!
    </iframe>`
})
export class PdfViewerComponent {

  documentUrl: SafeResourceUrl;
  @Input() url: string = 'document';

  constructor(private sanitizer: DomSanitizer,
              private _storage: StorageService) {
  }

  @Input() set doc(doc: DocumentDto) {
    this.documentUrl = doc ? this.sanitizer.bypassSecurityTrustResourceUrl(this.getFileUrl(doc)) : null;
  }

  public getFileUrl(doc: DocumentDto) {
    
	let filename = encodeURIComponent(doc.name + '.pdf');
	let args = `token=${this._storage.getAccessToken()}&convert=true&id=${doc.id}&filename=${filename}`;
	let serverUrl = `${SERVER_URL}/${this.url}?${args}`;
	
    return `${location.origin}${location.pathname}/assets/pdfjs/web/viewer.html?file=${encodeURIComponent(serverUrl)}`;
  }
}
