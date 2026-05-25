import {BureauDto} from "@app/dto/BureauDto";
import {IdNameDto} from "@app/dto/IdNameDto";
import {SectionDto} from "@app/dto/SectionDto";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {CatalogDto} from "@app/dto/CatalogDto";

export class CouncilDto extends IdNameDto {
  disabled: boolean;
  code: number;
  bureau: BureauDto;
  sections: SectionDto[] = [];
  belisaWorkers: PersonPlainDto[] = [];
  mainBelisaWorker: PersonPlainDto;
  directions: CatalogDto[] = [];
  // for ui
  isEdit: boolean;
  isExpanded: boolean;

  constructor() {
    super();
    this.name = ''; // for correct sorting
  }
}
