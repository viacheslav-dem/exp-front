import {IdDto} from "@app/dto/IdDto";
import {ScienceAreaDto} from "@app/dto/ScienceAreaDto";
import {DegreeType} from "@app/pipes/degree.pipe";

export class FullDegreeDto extends IdDto {
  scienceArea: ScienceAreaDto;
  degreeType: string = DegreeType.CANDIDATE;
  issuedBy: string;
  degreeNumber: string;
}
