import {IdDto} from "@app/dto/IdDto";
import {TermsStatsDto} from "@app/dto/TermsStatsDto";
import {CouncilPlainDto} from "@app/dto/CouncilPlainDto";

export class CouncilStatsDto extends IdDto {
  startDate: number;
  council: CouncilPlainDto;
  finishedProjects: number;
  projectOnExamination: number;
  projectsAccepted: number;
  projectsRejected: number;
  projectsReceived: number;
  projectsNotFinished: number;
  projectsReturned: number;
  projectsReturnedWithoutExpertise: number;
  projectsOverdue: number;
  examinationTermsStats: TermsStatsDto;
}
