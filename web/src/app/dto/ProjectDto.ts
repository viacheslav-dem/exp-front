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

export class ProjectDto extends HasState {
  title: string;
  period: PeriodDto;
  currency: IdNameDto;
  financing: FundingDto[] = [];
  createdDate: number;
  registerDate: number;
  executor: string;
  code: ProjectCodePlainDto;
  directions: CatalogDto[] = [];
  socialEconomicGoals: CatalogDto[] = [];
  documents: DocumentDto[] = [];
  program: IdNameDto;
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
