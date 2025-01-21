import {IdDto} from "@app/dto/IdDto";
import {OrgDto} from "@app/dto/OrgDto";
import {PhoneDto} from "@app/dto/PhoneDto";
import {IdNameDto} from "@app/dto/IdNameDto";
import {ExpertStatsDto} from "@app/dto/ExpertStatsDto";
import {ExpertRealTimeStatsDto} from "@app/dto/ExpertRealTimeStatsDto";
import {PersonInfoDto} from "@app/dto/PersonInfoDto";
import {PersonNameDto} from "@app/dto/PersonNameDto";

export class PersonExpertDto extends IdDto {
  personName:PersonNameDto;
  email: string;
  org: OrgDto;
  personInfo: PersonInfoDto;
  post: string;
  phones: PhoneDto[] = [];
  isExpertOrg: boolean;
  areas: IdNameDto[] = [];
  stats: ExpertStatsDto[] = [];
  realTimeStats: ExpertRealTimeStatsDto;
}
