import {PeriodDto} from "@app/dto/PeriodDto";
import {HasState} from "@app/dto/HasState";
import {PersonCustomerDto} from "@app/dto/PersonCustomerDto";
import {ProjectCodePlainDto} from "@app/dto/ProjectCodePlainDto";
import {CouncilReferenceDto} from "@app/dto/CouncilReferenceDto";

export class ProjectLiDto extends HasState {
  title: string;
  period: PeriodDto;
  customer: PersonCustomerDto;
  code: ProjectCodePlainDto;
  viewed: boolean;
  councilReferences: CouncilReferenceDto[] = [];
  isExpertReviewFiftyFifty: boolean;
}
