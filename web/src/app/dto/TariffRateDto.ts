import {CatalogDto} from "@app/dto/CatalogDto";

export class TariffRateDto extends CatalogDto {
  doctor: number;
  candidate: number;
  withoutDegree: number;
  expertOrg: number;
  councilMember: number;
}