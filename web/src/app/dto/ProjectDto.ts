import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {ExpertReviewDto} from "@app/dto/ExpertReviewDto";
import {PeriodDto} from "@app/dto/PeriodDto";
import {DocumentDto} from "@app/dto/DocumentDto";
import {PersonCustomerDto} from "@app/dto/PersonCustomerDto";
import {IdNameDto} from "@app/dto/IdNameDto";
import {CatalogDto} from "@app/dto/CatalogDto";
import {ProjectCodePlainDto} from "@app/dto/ProjectCodePlainDto";
import {HasState} from "@app/dto/HasState";
import {FundingDto} from "@app/dto/FundingDto";
import {DirectionDto} from "@app/dto/DirectionDto";
import {SubDirectionDto} from "@app/dto/SubDirectionDto";
import {PeriodNIOKTRDto} from "@app/dto/PeriodNIOKTRDto";
import {PeriodInnovationDto} from "@app/dto/PeriodInnovationDto";

export class ProjectDto extends HasState {
  title: string;
  period: PeriodDto;
  nioktrPeriod: string;
  innovationPeriod: string;
  currency: IdNameDto;
  study: IdNameDto;
  financing: FundingDto[] = [];
  createdDate: number;
  registerDate: number;
  executor: string;
  code: ProjectCodePlainDto;
  directions: CatalogDto[] = [];

  subDirections: SubDirectionDto[] = [];
  socialEconomicGoals: CatalogDto[] = [];
  documents: DocumentDto[] = [];
  program: string;
  customer: PersonCustomerDto;
  subCustomer: PersonCustomerDto;
  returnReason: String;
  decisionDocument: DocumentDto;
  gkntDepartment: IdNameDto;
  gkntWorker: PersonPlainDto;
  gkntChairman: PersonPlainDto;
  gkntDepartmentChairman: PersonPlainDto;
  expertReviews: ExpertReviewDto[];
  registrationNumber: string;
  isRescheduleSection: boolean;
  isRescheduleBureau: boolean;
  canAddDocumentsForCustomerForSection: boolean;
  canAddDocumentsForCustomerForBureau: boolean;
  isSectionRemarksExpired: boolean;
  isBureauRemarksExpired: boolean;
  productName: string;
  orgProduction: string;
  highTechProduction: string;
  productionOnRB: number;
  exportAndImport: number;

}
