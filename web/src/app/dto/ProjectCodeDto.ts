import {IdNameDto} from "@app/dto/IdNameDto";
import {CatalogDto} from "@app/dto/CatalogDto";
import {TariffRateDto} from "@app/dto/TariffRateDto";

export class ProjectCodeDto extends CatalogDto {
  code: string;
  expertReviewType: string;
  gkntDepartment: IdNameDto;
  coefficients: TariffRateDto;

  constructor() {
    super();
    this.code = ''; // for correct sorting
  }
}
