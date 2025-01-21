import {ProjectDto} from "@app/dto/ProjectDto";
import {CouncilDto} from "@app/dto/CouncilDto";

export class CouncilReferenceDto {
    project: ProjectDto;
    council: CouncilDto;
    number: number;
    date: Date;
}
