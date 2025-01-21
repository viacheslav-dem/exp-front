import {IdNameDto} from "@app/dto/IdNameDto";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {ProjectLifecycleDto} from "@app/dto/ProjectLifecycleDto";

export class RemarkDto extends IdNameDto {
  question: string;
  answer: string;
  group: LifecycleGroupDto;
  lifecycle: ProjectLifecycleDto;
}

