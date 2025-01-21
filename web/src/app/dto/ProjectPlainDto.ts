import {ProjectCodePlainDto} from "@app/dto/ProjectCodePlainDto";
import {IdNameDto} from "@app/dto/IdNameDto";
import {CatalogDto} from "@app/dto/CatalogDto";

export class ProjectPlainDto extends IdNameDto {
  title: string;
  code: ProjectCodePlainDto;
  isChecked: boolean;
  expertRemarksCount: number;
  isRescheduleSection: boolean;
  isRescheduleBureau: boolean;
  currency: IdNameDto;
  directions: CatalogDto[] = [];
  socialEconomicGoals: CatalogDto[] = [];
}
