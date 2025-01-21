import {TermsViolationDto} from "@app/dto/ViolationDto";

export class RealTimeStatsDto {
  date: number;
  gkntProjects: number;
  councilProjects: number;
  expertReviewsOnExamination: number;
  expertReviewsOnConfirmation: number;
  expertReviewsTermsViolation: TermsViolationDto;
  projectTermsViolation: TermsViolationDto;
  paymentTermsViolation: TermsViolationDto;
  paymentWaiting: number;
  paymentWaitingSum: number;
}
