import {parse, getTime} from 'date-fns';

export class PeriodDto {

    start: number;
    end: number;

    constructor(start?: number | string, end?: number | string) {
        this.start = this.parse(start);
        this.end = this.parse(end);
    }

    parse(date: number | string): number {
        if (date == null || date === undefined) {
            return null;
        }
        if (typeof date === 'string') {
            return getTime(parse(date, 'yyyy-MM-dd HH:mm:ss', new Date()));
        }
        return date;
    }
}
