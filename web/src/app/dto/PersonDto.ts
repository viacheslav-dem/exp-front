import {IdNameDto} from "@app/dto/IdNameDto";
import {PersonInfoDto} from "@app/dto/PersonInfoDto";
import {UserDto} from "@app/dto/UserDto";
import {PhoneDto} from "@app/dto/PhoneDto";
import {SectionPlainDto} from "@app/dto/SectionPlainDto";
import {BureauPlainDto} from "@app/dto/BureauPlainDto";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";

export class PersonDto extends PersonPlainDto {
  email: string;
  org: IdNameDto;
  personInfo: PersonInfoDto;
  post: string;
  phones: PhoneDto[];
  roles: string[];
  areas: IdNameDto[];
  user: UserDto;
  isExpertOrg: boolean;
  current: boolean;
  //field to mark deleted person in list
  deleted: boolean;
  bureaus: BureauPlainDto[];
  sections: SectionPlainDto[];

}
