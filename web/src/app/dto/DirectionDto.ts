import {SectionDto} from "@app/dto/SectionDto";
import {SubDirectionDto} from "@app/dto/SubDirectionDto";
import {CatalogDto} from "@app/dto/CatalogDto";

export class DirectionDto extends CatalogDto{
    subDirectionDtos: SubDirectionDto[] = [];

}