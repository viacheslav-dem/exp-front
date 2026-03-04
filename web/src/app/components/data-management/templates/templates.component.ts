import {ChangeDetectionStrategy, ChangeDetectorRef, Component, AfterViewInit, effect, viewChildren} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {timer} from 'rxjs';
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {DocumentService} from "@app/services/document.service";
import {TemplateDocumentDto} from "@app/dto/TemplateDocumentDto";
import {DocType} from "@app/components/common-components/file-uploader/doc-type";
import {SERVER_URL} from "@app/config";
import {SilentFileUploaderComponent} from "@app/components/common-components/file-uploader/silent-file-uploader/silent-file-uploader.component";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-templates',
    templateUrl: './templates.component.html',
    styleUrls: ['./templates.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.dataManagement) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class TemplatesComponent extends FilterAndPages<TemplateDocumentDto> implements AfterViewInit {

  DocType = DocType;
  SERVER_URL = SERVER_URL;

  templates: TemplateDocumentDto[];
  selectedTemplate: TemplateDocumentDto;
  editedTemplate: TemplateDocumentDto;
  
  isDragOverDocx: number | null = null;
  isDragOverXml: number | null = null;

  readonly fileUploaders = viewChildren(SilentFileUploaderComponent);

  private uploaderMap: Map<string, SilentFileUploaderComponent> = new Map();

  private readonly fileUploadersEffect = effect(() => {
    this.fileUploaders();
    this.updateUploaderMap();
  });

  constructor(private _toasty: GlobalToastyService,
              private _documentService: DocumentService,
              private cdr: ChangeDetectorRef) {
    super();
  }

  ngAfterViewInit() {
    this.updateUploaderMap();
  }

  private updateUploaderMap() {
    this.uploaderMap.clear();
    const uploaders = this.fileUploaders();
    if (!this.templates || !uploaders?.length) {
      return;
    }

    // Сопоставляем загрузчики с шаблонами по URL
    for (const template of this.templates) {
      if (template.isEdit) {
        const docxUrl = `${this.SERVER_URL}/document/template/source?id=${template.id}`;
        const xmlUrl = `${this.SERVER_URL}/document/template-xml/source?id=${template.id}`;
        
        for (const uploader of uploaders) {
          const uploaderUrl = uploader.getUrl();
          if (uploaderUrl === docxUrl) {
            this.uploaderMap.set(`${template.id}_docx`, uploader);
          } else if (uploaderUrl === xmlUrl) {
            this.uploaderMap.set(`${template.id}_xml`, uploader);
          }
        }
      }
    }
  }

  ngOnInit() {
    this._searchFields = [
      SearchField.contains('name').setPlaceholder('Поиск по наименованию...')
        .setSortDirection(Direction.ASC).setSortable(true).setMultipleSorting(true),
      SearchField.contains('description').setPlaceholder('Поиск по описанию...')
        .setSortDirection(Direction.ASC).setSortable(true).setMultipleSorting(true),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
    this.enableFilterCache("templates");
    // Если нет сохранённого состояния фильтров, загружаем данные явно
    timer(100).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const hasCachedFilters = localStorage.getItem('filter_cache_templates');
      if (!hasCachedFilters) {
        this.update();
      }
    });
  }

  loadPage() {
    this._documentService.getTemplatesPage(this._searchRequest).subscribe(res => {
      this.setLoading(false);
      this._page = res;
      this.templates = this._page.content;
      // Обновляем карту загрузчиков после загрузки данных
      timer(0).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.updateUploaderMap();
        this.cdr?.markForCheck?.();
      });
      // show tooltips
    }, () => {
      this.setLoading(false);
      this.cdr?.markForCheck?.();
    });
  }

  editTemplate(template: TemplateDocumentDto) {
    if (this.selectedTemplate) {
      this.selectedTemplate.isEdit = false;
    }
    this.selectedTemplate = template;
    this.editedTemplate = TemplatesComponent.copyTemplate(this.selectedTemplate);
    this.selectedTemplate.isEdit = true;
    // Обновляем карту загрузчиков после изменения состояния редактирования
    timer(0).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateUploaderMap());
  }

  cancelEditTemplate() {
    this.selectedTemplate.isEdit = false;
    // Обновляем карту загрузчиков после отмены редактирования
    timer(0).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateUploaderMap());
  }

  saveEditedTemplate() {
    this._documentService.saveTemplate(this.editedTemplate).subscribe(() => {
      this._toasty.success("Сохранено.");
      this.update();
    });
  }

  downloadTemplate(template: TemplateDocumentDto) {
    this._documentService.downloadTemplate(template.id).subscribe();
  }

  downloadTemplateXml(template: TemplateDocumentDto) {
    this._documentService.downloadTemplateXml(template.id).subscribe();
  }

  static copyTemplate(template: TemplateDocumentDto) {
    return Object.assign({}, template);
  }
  
  onDragOver(event: DragEvent, type: 'docx' | 'xml', template: TemplateDocumentDto) {
    event.preventDefault();
    event.stopPropagation();
    if (type === 'docx') {
      this.isDragOverDocx = template.id;
    } else {
      this.isDragOverXml = template.id;
    }
    this.cdr?.markForCheck?.();
  }

  onDragLeave(event: DragEvent, type: 'docx' | 'xml') {
    event.preventDefault();
    event.stopPropagation();
    if (type === 'docx') {
      this.isDragOverDocx = null;
    } else {
      this.isDragOverXml = null;
    }
    this.cdr?.markForCheck?.();
  }

  onDrop(event: DragEvent, type: 'docx' | 'xml', template: TemplateDocumentDto, uploader?: SilentFileUploaderComponent) {
    event.preventDefault();
    event.stopPropagation();
    if (type === 'docx') {
      this.isDragOverDocx = null;
    } else {
      this.isDragOverXml = null;
    }
    const files = event.dataTransfer && event.dataTransfer.files;
    if (files && files.length) {
      const effectiveUploader =
        uploader ?? this.uploaderMap.get(`${template.id}_${type}`);

      if (!effectiveUploader) {
        // Важно для прод-диагностики: если мапа не успела обновиться, drag&drop "молчит".
        this._toasty.warn("Не удалось определить загрузчик для выбранного шаблона. Попробуйте выбрать файл через диалог или обновить страницу.");
        this.cdr?.markForCheck?.();
        return;
      }

      effectiveUploader.onFilesChosen(Array.from(files) as File[]);
      this.cdr?.markForCheck?.();
    }
  }
}
