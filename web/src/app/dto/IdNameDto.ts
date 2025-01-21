import {IdDto} from "@app/dto/IdDto";

export class IdNameDto extends IdDto {

  name: string;
  isChecked: boolean;

  constructor(id?: number, name?: string) {
    super(id);
    this.name = name;
  }
}
