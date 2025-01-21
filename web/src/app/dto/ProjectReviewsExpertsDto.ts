import {PersonCustomerDto} from "@app/dto/PersonCustomerDto";
import {ProjectCodePlainDto} from "@app/dto/ProjectCodePlainDto";
import {HasState} from "@app/dto/HasState";
import {ExpertReviewAndExpertDto} from "@app/dto/ExpertReviewAndExpertDto";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";

export class ProjectReviewsExpertsDto extends HasState {
  title: string;
  executor: string;
  code: ProjectCodePlainDto;
  customer: PersonCustomerDto;
  expertReviews: ExpertReviewAndExpertDto[];
  groups: LifecycleGroupDto[];
  registerDate: number;
}
