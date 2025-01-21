import {CatalogDto} from "@app/dto/CatalogDto";

export class IndustryDto extends CatalogDto {
  code: string;
  addedValueBound: number;
  constructor() {
    super();
    this.code = ''; // for correct sorting
  }
}
