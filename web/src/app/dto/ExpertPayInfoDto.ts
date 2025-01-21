import {ProjectDto} from "@app/dto/ProjectDto";
import {CouncilDto} from "@app/dto/CouncilDto";

export class ExpertPayInfoDto {

    project: ProjectDto;
    councils: CouncilDto[] = [];
    contractDate: Date;
    contractEnd: Date;
    actDate: Date;
    payDate: Date;

}
