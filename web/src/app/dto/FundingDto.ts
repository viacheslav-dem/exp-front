import {CatalogDto} from "@app/dto/CatalogDto";

export class FundingDto {
  value: number;
  comment: string;
  source: CatalogDto;
  type: string;
}
