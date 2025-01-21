import * as moment from "moment";

export class PeriodDto {

    start: number;
    end: number;

    constructor(start?: number | string, end?: number | string) {
        this.start = this.parse(start);
        this.end = this.parse(end);
    }

    parse(date: number | string): number {
        if (typeof date === 'string') {
            return moment(date, 'YYYY-MM-DD HH:mm:ss').toDate().getTime();
        }
        return date;
    }
}
