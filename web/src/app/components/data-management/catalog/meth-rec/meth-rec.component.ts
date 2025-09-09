import {Component} from "@angular/core";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {TemplateDocumentDto} from "@app/dto/TemplateDocumentDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {DocumentService} from "@app/services/document.service";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {TemplatesComponent} from "@app/components/data-management/templates/templates.component";
import {DocType} from "@app/components/common-components/file-uploader/doc-type";
import {SERVER_URL} from "@app/config";

@Component({
    selector: 'app-meth-rec',
    templateUrl: './meth-rec.component.html'
})
export class MethRecComponent extends FilterAndPages<TemplateDocumentDto> {

    DocType = DocType;
    SERVER_URL = SERVER_URL;

    templates: TemplateDocumentDto[];
    selectedTemplate: TemplateDocumentDto;
    editedTemplate: TemplateDocumentDto;

    constructor(private _toasty: GlobalToastyService,
                private _documentService: DocumentService) {
        super();
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
    }

    loadPage() {
        this._documentService.getTemplatesPage(this._searchRequest).subscribe(res => {
            this.setLoading(false);
            this._page = res;
            this.templates = this._page.content;
            // show tooltips
            setTimeout(() => $('.templateType[data-toggle="tooltip"]')['tooltip'](), 500);
        }, () => this.setLoading(false));
    }

    editTemplate(template: TemplateDocumentDto) {
        if (this.selectedTemplate) {
            this.selectedTemplate.isEdit = false;
        }
        this.selectedTemplate = template;
        this.editedTemplate = TemplatesComponent.copyTemplate(this.selectedTemplate);
        this.selectedTemplate.isEdit = true;
    }

    cancelEditTemplate() {
        this.selectedTemplate.isEdit = false;
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
}
