import {CatalogDto} from "@app/dto/CatalogDto";

export class MailTemplateDto extends CatalogDto {
  type: string;
  priority: string;
  subject: string;
  body: string;
  isExpanded: boolean;
}
