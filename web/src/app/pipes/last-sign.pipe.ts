import {Pipe} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";
import {AuditTypes} from "@app/pipes/audit-type.pipe";

@Pipe({
    name: 'lastSign',
    standalone: false
})
export class LastSignEnumPipe extends AbstractEnumPipe<LastSignEnum> {

    init() {
        this.map[LastSignEnum.MONTH] = 'Месяц';
        this.map[LastSignEnum.HALF_YEAR] = 'Пол года';
        this.map[LastSignEnum.YEAR] = 'Год';
        this.map[LastSignEnum.TWO_YEAR] = 'Два года' ;
        this.map[LastSignEnum.OVER_TWO_YEARS] = 'Более 2-х лет';
        this.map[LastSignEnum.NEVER] = 'Никогда';
    }

    sortAllSignTypes(lastSign: string[]) {
        return lastSign;
    }

    getAllSignTypes() {
        return this.sortAllSignTypes(Object.keys(LastSignEnum));
    }
}

export enum LastSignEnum {
    MONTH = 'MONTH',
    HALF_YEAR = 'HALF_YEAR',
    YEAR = 'YEAR',
    TWO_YEAR = 'TWO_YEAR',
    OVER_TWO_YEARS = 'OVER_TWO_YEARS',
    NEVER = 'NEVER'
}
