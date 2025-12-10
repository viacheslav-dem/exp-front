import {Component} from '@angular/core';
import {CatalogTemplate} from "@app/components/data-management/catalog/CatalogTemplate";
import {ManualDto} from "@app/dto/ManualDto";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {Catalog, DataService} from "@app/services/data.service";
import {RolePipe} from "@app/pipes/role.pipe";
import {SERVER_URL} from "@app/config";
import {DocType} from "@app/components/common-components/file-uploader/doc-type";
import {DocumentService} from "@app/services/document.service";

@Component({
    selector: 'app-user-manual',
    template: `
    <h5 class="mb-3">Руководства пользователя</h5>
    <div class="list-group">

      <div [loadingData]="_loading">
        <!--MANUALS-->
        <div *ngFor="let manual of items">
          <!--MANUAL HEADER-->
          <div class="list-group-item border-bottom-none">
            <div class="text-mini font-weight-bold" style="height: 1.5rem">
              руководство пользователя
            </div>
            <div class="form-sub-group">
              <div class="d-inline-block" style="width: 350px;">{{manual.role | role}}:</div>
              <ng-container *ngIf="manual.document">
                <button class="btn btn-sm btn-outline-primary" (click)="downloadDocument(manual)">
                  Скачать <fa-icon icon="arrow-down"></fa-icon>
                </button>
                или
              </ng-container>
              <app-silent-file-uploader
                [controlClass]="'width-auto custom-file-inline'"
                [typesAccept]="DocType.PDF.extension"
                (saved)="addDocument($event,  manual)"
                [url]="SERVER_URL + '/data/manual/' + manual.id + '/document'">
              </app-silent-file-uploader>
            </div>          
          </div>
        </div>
        <div *ngIf="!items || items.length == 0">
          <div class="italic list-group-item background-light-blue">
            Сообщения отсутствуют
          </div>
        </div>
        <app-pagination
          [page]="_page" [pagination]="_pagination"
          (onPageChanged)="onPageChanged($event)">
        </app-pagination>
      </div>
    </div>
  `,
    styles: [],
    standalone: false
})
export class UserManualComponent extends CatalogTemplate<ManualDto> {
  DocType = DocType;
  SERVER_URL = SERVER_URL;

  constructor(public _toasty: GlobalToastyService,
              public _dataService: DataService,
              private _rolePipe: RolePipe,
              private _documentService: DocumentService) {
    super(_toasty, _dataService,20);
    this.type = Catalog.MANUAL;
  }

  ngOnInit() {
    this._searchFields = [
      SearchField.contains('role').setPlaceholder('Поиск по наименованию...')
        .setSortDirection(Direction.ASC).setSortable(true).setMultipleSorting(true),
    ];

  }

  create(): ManualDto {
    return new ManualDto();
  }

  addDocument(doc, manual: ManualDto) {
    manual.document = doc.document;
  }

  downloadDocument(manual) {
    this._documentService.downloadDocument(manual.document).subscribe();
  }
}
