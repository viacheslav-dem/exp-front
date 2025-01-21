import {CouncilPlainDto} from "@app/dto/CouncilPlainDto";
import {TermsStatsDto} from "@app/dto/TermsStatsDto";

export class CouncilStatsResponseDTO{
    id: number;
    startDate: number;
    council: CouncilPlainDto;
    finishedProjects: number;
    projectsAccepted: number;
    projectsRejected: number;
    projectsReceived: number;
    projectsNotFinished: number;
    projectsReturned: number;
    projectsReturnedWithoutExpertise: number;
    projectsOverdue: number;
    examinationTermsStats: TermsStatsDto;
    overdueDaysProject: number;
}