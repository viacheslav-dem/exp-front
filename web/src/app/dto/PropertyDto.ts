import {PropertyPlainDto} from "@app/dto/PropertyPlainDto";

export class PropertyDto extends PropertyPlainDto {
  value: any;
}

export class AuthPolicy {
  authCount: number;
}