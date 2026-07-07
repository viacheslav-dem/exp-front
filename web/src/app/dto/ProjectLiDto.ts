import {PeriodDto} from "@app/dto/PeriodDto";
import {HasState} from "@app/dto/HasState";
import {PersonCustomerDto} from "@app/dto/PersonCustomerDto";
import {ProjectCodePlainDto} from "@app/dto/ProjectCodePlainDto";
import {CouncilReferenceDto} from "@app/dto/CouncilReferenceDto";
import {SectionPlainDto} from "@app/dto/SectionPlainDto";

export class ProjectLiDto extends HasState {
  title: string;
  period: PeriodDto;
  customer: PersonCustomerDto;
  code: ProjectCodePlainDto;
  viewed: boolean;
  councilReferences: CouncilReferenceDto[] = [];
  isExpertReviewFiftyFifty: boolean;
  sections: SectionPlainDto[];
  /** Признак наличия замечаний экспертов/бюро/секции по объекту (для выделения в списке у аппарата бюро ГЭС). */
  hasRemarks?: boolean;
  /** Признак наличия подготовленного письма о возврате заказчику (используется для массовой отправки). */
  hasDecisionDocument?: boolean;
}
