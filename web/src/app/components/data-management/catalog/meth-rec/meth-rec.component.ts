import {Component, viewChild} from "@angular/core";
import {DocType} from "@app/components/common-components/file-uploader/doc-type";
import {SERVER_URL} from "@app/config";
import {SilentFileUploaderComponent} from "@app/components/common-components/file-uploader/silent-file-uploader/silent-file-uploader.component";

@Component({
    selector: 'app-meth-rec',
    templateUrl: './meth-rec.component.html',
    styleUrls: ['./meth-rec.component.scss'],
    standalone: false
})
export class MethRecComponent {

    DocType = DocType;
    SERVER_URL = SERVER_URL;
    isDragOver: boolean = false;
    
    readonly fileUploader = viewChild(SilentFileUploaderComponent);

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = false;
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = false;
        const files = event.dataTransfer && event.dataTransfer.files;
        const fileUploader = this.fileUploader();
        if (files && files.length && fileUploader) {
            fileUploader.onFilesChosen(Array.from(files) as File[]);
        }
    }
}
