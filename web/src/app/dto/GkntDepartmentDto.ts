import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {CatalogDto} from "@app/dto/CatalogDto";

export class GkntDepartmentDto extends CatalogDto {

  shortName: string;
  code: string;
  chairman: PersonPlainDto;
  deputyChairman: PersonPlainDto;
  gkntChairman: PersonPlainDto;
  persons: PersonPlainDto[] = [];

  isExpanded: boolean;

  constructor() {
    super();
    this.name = ''; // for correct sorting
  }
}
