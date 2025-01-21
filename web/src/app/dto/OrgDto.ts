import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {IdNameDto} from "@app/dto/IdNameDto";

export class OrgDto extends IdNameDto {

  shortName: string;
  code: string;
  unp: string;
  orgAddress: string;
  chairman: PersonPlainDto;
  disabled: boolean;
  childOrgs: OrgDto[] = [];
  parentOrg: OrgDto;
  isEdit: boolean;
  isExpanded: boolean;

  constructor() {
    super();
    this.name = ''; // for correct sorting
  }
}
