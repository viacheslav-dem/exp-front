import {CatalogDto} from "@app/dto/CatalogDto";

export class SpecializationDto extends CatalogDto {
    code: string;

    constructor() {
        super();
        this.code = ''; // for correct sorting
    }
}
