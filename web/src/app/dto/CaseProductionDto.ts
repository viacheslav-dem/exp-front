import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {IdDto} from "@app/dto/IdDto";
import {PersonNameDto} from "@app/dto/PersonNameDto";

export class CaseProductionDto extends IdDto {
    id: number;
    registrationDate: Date;
    organization: string;
    fio: PersonNameDto;
    document: boolean;
}

