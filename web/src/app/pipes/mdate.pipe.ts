import {Pipe, PipeTransform} from "@angular/core";
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';
import {firstCharToUpperCase} from "../support/utils";

@Pipe({name: 'mdate'})
export class MdatePipe implements PipeTransform {

  transform(value: number): any {
    return value ? dayjs(value).locale('ru').format('DD.MM.YYYY') : value;
  }
}

@Pipe({name: 'mtime'})
export class MTimePipe implements PipeTransform {

  transform(value: number): any {
    return value ? dayjs(value).locale('ru').format('HH:mm') : value;
  }
}

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {

  transform(value: number, formatStr: string = 'DD.MM.YYYY HH:mm:ss'): any {
    if (!value) return value;
    // dayjs использует формат Moment.js, поэтому формат уже правильный
    return dayjs(value).locale('ru').format(formatStr);
  }
}

@Pipe({name: 'monthYear'})
export class MonthYearPipe implements PipeTransform {

  transform(value:any): any {
    return value ? firstCharToUpperCase(dayjs(value).locale('ru').format("MMMM YYYY")) : '';
  }
}

