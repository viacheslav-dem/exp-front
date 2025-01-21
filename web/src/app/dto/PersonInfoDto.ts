import {IdDto} from "@app/dto/IdDto";
import {BankAccountDto} from "@app/dto/BankAccountDto";
import {DisabilityDto} from "@app/dto/DisabilityDto";
import {PassportDto} from "@app/dto/PassportDto";
import {PersonNameDto} from "@app/dto/PersonNameDto";
import {FullDegreeDto} from "@app/dto/FullDegreeDto";

export class PersonInfoDto extends IdDto {
  nameInDative:PersonNameDto;
  nameInGenitive: PersonNameDto;
  degreeType: string;
  degree: string;
  birthDate: number;
  singDate: number;
  academicTitleType: string;
  address: string;
  bankAccount: BankAccountDto;
  passport: PassportDto;
  specialty: string;
  disability: DisabilityDto;
  specialization: string;
  specialities: any;
  specializations: any;
  fullDegrees: FullDegreeDto[];
}
