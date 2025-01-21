import {PeriodDto} from "@app/dto/PeriodDto";
import {IdDto} from "@app/dto/IdDto";

export class MeetingPostDto extends IdDto {
  projects: IdDto[];
  period: PeriodDto;
  place: string;

  constructor(period?: PeriodDto, place?: string, projects?: IdDto[], id?: number) {
    super(id);
    this.period = period;
    this.place = place;
    this.projects = projects;
  }
}
