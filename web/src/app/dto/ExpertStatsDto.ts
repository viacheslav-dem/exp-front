import {IdDto} from "@app/dto/IdDto";
import {TermsStatsDto} from "@app/dto/TermsStatsDto";

export class ExpertStatsDto extends IdDto {
  startDate: number;
  finishedProjects: number;
  projectsAccepted: number;
  projectsRejected: number;
  reviewsRejected: number;
  reviewsTermsStats: TermsStatsDto;
}
