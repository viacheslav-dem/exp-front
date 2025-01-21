import {IdDto} from "@app/dto/IdDto";

export class PropertyPlainDto extends IdDto {
  type: string;
  description: string;
  disabled: boolean;
  isEdit: boolean;
}
