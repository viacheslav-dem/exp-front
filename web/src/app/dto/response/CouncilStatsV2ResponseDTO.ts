import {CouncilPlainDto} from "@app/dto/CouncilPlainDto";
import {TermsStatsDto} from "@app/dto/TermsStatsDto";

export class CouncilStatsV2ResponseDTO{
    id: number;
    startDate: number;
    council: CouncilPlainDto;
    finishedProjects: number;
    projectsReceived: number;
    projectsNotFinished: number;
    projectsOverdue: number;
    overdueDaysProject: number;
}