import {CatalogDto} from "@app/dto/CatalogDto";
import {DocumentDto} from "@app/dto/DocumentDto";

export class ManualDto extends CatalogDto {
  role: string;
  document: DocumentDto;

}