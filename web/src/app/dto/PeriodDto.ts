import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

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
            return dayjs(date, 'YYYY-MM-DD HH:mm:ss').valueOf();
        }
        return date;
    }
}
