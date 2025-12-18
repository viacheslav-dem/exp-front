import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
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
  
  @ViewChildren(SilentFileUploaderComponent) fileUploaders: QueryList<SilentFileUploaderComponent>;
  
  private uploaderMap: Map<string, SilentFileUploaderComponent> = new Map();

  constructor(private _toasty: GlobalToastyService,
              private _documentService: DocumentService,
              private cdr: ChangeDetectorRef) {
    super();
  }
  
  ngAfterViewInit() {
    // Регистрируем загрузчики после инициализации представления
    this.fileUploaders.changes.subscribe(() => {
      this.updateUploaderMap();
    });
    this.updateUploaderMap();
  }
  
  private updateUploaderMap() {
    this.uploaderMap.clear();
    if (!this.templates || !this.fileUploaders) {
      return;
    }
    
    // Сопоставляем загрузчики с шаблонами по URL
    const uploaders = this.fileUploaders.toArray();
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
    setTimeout(() => {
      const hasCachedFilters = localStorage.getItem('filter_cache_templates');
      if (!hasCachedFilters) {
        this.update();
      }
    }, 100);
  }

  loadPage() {
    this._documentService.getTemplatesPage(this._searchRequest).subscribe(res => {
      this.setLoading(false);
      this._page = res;
      this.templates = this._page.content;
      // Обновляем карту загрузчиков после загрузки данных
      setTimeout(() => {
        this.updateUploaderMap();
        this.cdr?.markForCheck?.();
      }, 0);
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
    setTimeout(() => this.updateUploaderMap(), 0);
  }

  cancelEditTemplate() {
    this.selectedTemplate.isEdit = false;
    // Обновляем карту загрузчиков после отмены редактирования
    setTimeout(() => this.updateUploaderMap(), 0);
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
  }

  onDragLeave(event: DragEvent, type: 'docx' | 'xml') {
    event.preventDefault();
    event.stopPropagation();
    if (type === 'docx') {
      this.isDragOverDocx = null;
    } else {
      this.isDragOverXml = null;
    }
  }

  onDrop(event: DragEvent, type: 'docx' | 'xml', template: TemplateDocumentDto) {
    event.preventDefault();
    event.stopPropagation();
    if (type === 'docx') {
      this.isDragOverDocx = null;
    } else {
      this.isDragOverXml = null;
    }
    const files = event.dataTransfer && event.dataTransfer.files;
    if (files && files.length) {
      const key = `${template.id}_${type}`;
      const uploader = this.uploaderMap.get(key);
      if (uploader) {
        uploader.onFilesChosen(Array.from(files) as File[]);
      }
    }
  }
}
