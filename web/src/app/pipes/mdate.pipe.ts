import {Pipe, PipeTransform} from "@angular/core";
import * as moment from 'moment';
import {firstCharToUpperCase} from "../support/utils";

@Pipe({name: 'mdate'})
export class MdatePipe implements PipeTransform {

  transform(value: number): any {
    return value ? moment(value, 'x').format('DD.MM.YYYY') : value;
  }
}

@Pipe({name: 'mtime'})
export class MTimePipe implements PipeTransform {

  transform(value: number): any {
    return value ? moment(value, 'x').format('HH:mm') : value;
  }
}

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {

  transform(value: number, format: string = 'DD.MM.YYYY HH:mm:ss'): any {
    return value ? moment(value, 'x').format(format) : value;
  }
}

@Pipe({name: 'monthYear'})
export class MonthYearPipe implements PipeTransform {

  transform(value:any): any {
    return value ? firstCharToUpperCase(moment(value).format("MMMM YYYY")) : '';
  }
}

