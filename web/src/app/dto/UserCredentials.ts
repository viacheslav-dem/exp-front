import {IdDto} from "@app/dto/IdDto";
import {PersonNameDto} from "@app/dto/PersonNameDto";
import {RoleInfoDto} from "@app/dto/RoleInfoDto";

export class UserCredentials extends IdDto {
  roles: string[];
  rolesInfo: RoleInfoDto[] = [];
  personName: PersonNameDto;
  accessToken: string;
  refreshToken: string;
  passwordExpired: boolean;
}
