import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GlobalToastyService} from "app/services/global-toasty.service";
import {Catalog, DataService} from "app/services/data.service";
import {SearchField} from "app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "app/components/common-components/page-and-filter/model/SortOrder";
import {CatalogTemplate} from "app/components/data-management/catalog/CatalogTemplate";
import {MailTemplateDto} from "@app/dto/MailTemplateDto";
import {getAllMailPriorities, MailPriorityPipe} from "@app/pipes/mail-priority.pipe";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-mail-template',
    templateUrl: './mail-template.component.html',
    styles: [`
      pre {
          white-space: pre-wrap; /* Since CSS 2.1 */
          white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
          /*noinspection CssInvalidPropertyValue*/
          white-space: -pre-wrap; /* Opera 4-6 */
          white-space: -o-pre-wrap; /* Opera 7 */
          word-wrap: break-word; /* Internet Explorer 5.5+ */
      }
  `],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class MailTemplateComponent extends CatalogTemplate<MailTemplateDto> {

  mailPriorityToString: Function;
  allMailPriorities: string[] = getAllMailPriorities();

  constructor(public _toasty: GlobalToastyService,
              public _dataService: DataService,
              public _mailPriorityPipe: MailPriorityPipe) {
    super(_toasty, _dataService);
    this._type = Catalog.MAIL_TEMPLATE;
  }

  ngOnInit() {
    this._searchFields = [
      SearchField.contains('name').setPlaceholder('Поиск по названию...').setSortable(true).setSortDirection(Direction.ASC),
      SearchField.contains('subject').setPlaceholder('Поиск по теме сообщения...').setSortable(true),
      SearchField.contains('body').setPlaceholder('Поиск по тексту сообщения...'),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
    this.mailPriorityToString = p => this._mailPriorityPipe.transform(p);

  }

  create(): MailTemplateDto {
    return new MailTemplateDto();
  }
}
