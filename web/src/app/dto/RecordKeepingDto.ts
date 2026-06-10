import {CatalogDto} from "@app/dto/CatalogDto";

export class RecordKeepingDto extends CatalogDto {
    code: string;

    constructor() {
        super();
        this.code = ''; // for correct sorting
    }
}