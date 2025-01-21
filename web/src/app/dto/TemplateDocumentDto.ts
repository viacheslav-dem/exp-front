import {IdNameDto} from "@app/dto/IdNameDto";

export class TemplateDocumentDto extends IdNameDto {
  description: string;
  templateType: string;
  disabled: boolean;
  // for ui
  isEdit: boolean;

  constructor() {
    super();
    this.name = '';
  }
}
