import {IdDto} from "@app/dto/IdDto";

export class DocumentDto extends IdDto {
  name: string;
  description: string;
  hasDocx: boolean;
  isCustomer: boolean;
  /** true, если документ — архив (ZIP). */
  archive?: boolean;
}
