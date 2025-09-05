import {IdDto} from "@app/dto/IdDto";
import {DirectionDto} from "@app/dto/DirectionDto";

export class SubDirectionDto extends IdDto{
    directionName: string;
    direction: DirectionDto;

    // constructor(id: number, directionName: string) {
    //     super(id);
    //     this.directionName = directionName;
    // }

}