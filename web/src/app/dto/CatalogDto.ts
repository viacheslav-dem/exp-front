import {IdNameDto} from "@app/dto/IdNameDto";

export class CatalogDto extends IdNameDto {

  disabled: boolean;
  description: string;

  // for ui
  isEdit: boolean;

  constructor() {
    super();
    this.name = '';
  }
}
