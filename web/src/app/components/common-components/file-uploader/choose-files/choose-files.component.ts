import {ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, output, viewChild} from "@angular/core";
import {DocType} from "@app/components/common-components/file-uploader/doc-type";
import {environment} from "../../../../../environments/environment";
import {validateFilesForUpload} from "@app/components/common-components/file-uploader/file-upload-validator";
import {GlobalToastyService} from "@app/services/global-toasty.service";

@Component({
    selector: 'app-choose-files',
    templateUrl: 'choose-files.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.fileAndPdf)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class ChooseFilesComponent {

  readonly onFilesChosen = output<FileList>();
  readonly controlClass = input<any>(undefined);
  readonly typesAccept = input<string | string[]>([
    DocType.DOCX.extension, DocType.DOC.extension,
    DocType.PDF.extension, DocType.TIFF.extension
].join(','));
  /** Разрешить выбор нескольких файлов (при false — только один). */
  readonly allowMultiple = input<boolean>(false);
  readonly fileInput = viewChild<ElementRef>('fileInput');

  private readonly _toasty = inject(GlobalToastyService);

  /** Подсказка по размеру (computed — не пересчитывается лишний раз при CD). */
  readonly sizeHint = computed(() => {
    const accept = this.typesAccept();
    const hasZip = Array.isArray(accept)
      ? accept.includes(DocType.ZIP.extension)
      : (accept || '').includes('application/zip');
    return hasZip ? 'Документ до 10 МБ или zip архив до 50 МБ' : 'Не более 10 МБ';
  });

  chooseFiles(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files?.length > 0) {
      const result = validateFilesForUpload(Array.from(files), this.typesAccept());
      if (!result.valid) {
        this._toasty.err(400, result.message);
        const el = this.fileInput()?.nativeElement;
        if (el) el.value = '';
        return;
      }
      this.onFilesChosen.emit(files);
    }
    const el = this.fileInput()?.nativeElement;
    if (el) el.value = '';
  }
}
