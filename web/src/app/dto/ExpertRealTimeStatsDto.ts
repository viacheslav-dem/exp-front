import {TermsViolationDto} from "@app/dto/ViolationDto";

export class ExpertRealTimeStatsDto {
  date: number;
  projectsOnExamination: number;
  reviewsOnConfirmation: number;
  acceptedProjects: number;
  rejectedProjects: number;
  rejectedReviewsByExpert: number;
  rejectedReviewsByGknt: number;
  reviewsTermsViolation: TermsViolationDto;
}
