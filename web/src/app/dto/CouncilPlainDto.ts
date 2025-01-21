import {IdNameDto} from "@app/dto/IdNameDto";

export class CouncilPlainDto extends IdNameDto {

  code: number;

  constructor(name?: string, code?: number, id?: number) {
    super(id);
    this.name = name;
    this.code = code;
  }
}
