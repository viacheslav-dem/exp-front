import {IdDto} from "@app/dto/IdDto";
import {TermsStatsDto} from "@app/dto/TermsStatsDto";

export class StatsDto extends IdDto {
  startDate: number;
  endDate: number;
  finishedProjects: number;
  projectsAccepted: number;
  projectsRejected: number;
  projectsReturned: number;
  finishedExpertReviews: number;
  expertReviewsProjectAccepted: number;
  expertReviewsProjectRejected: number;
  expertReviewsRejected: number;
  expertReviewsTermsStats: TermsStatsDto;
  gkntConsiderationTermsStats: TermsStatsDto;
  councilsExaminationTermsStats: TermsStatsDto;
  gkntResultsForwardingTermsStats: TermsStatsDto;
  paymentTermsStats: TermsStatsDto;
  paid: number;
  paidSum: number;
}
