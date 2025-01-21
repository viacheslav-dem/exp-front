import {IdDto} from "@app/dto/IdDto";

export class UserDto extends IdDto {
  login: string;
  blocked: boolean;
}
