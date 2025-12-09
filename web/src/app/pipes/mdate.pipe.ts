import {Pipe, PipeTransform} from "@angular/core";
import {format, parseISO} from 'date-fns';
import {ru} from 'date-fns/locale';
import {firstCharToUpperCase} from "../support/utils";

@Pipe({name: 'mdate'})
export class MdatePipe implements PipeTransform {

  transform(value: number): any {
    return value ? format(new Date(value), 'dd.MM.yyyy', {locale: ru}) : value;
  }
}

@Pipe({name: 'mtime'})
export class MTimePipe implements PipeTransform {

  transform(value: number): any {
    return value ? format(new Date(value), 'HH:mm', {locale: ru}) : value;
  }
}

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {

  transform(value: number, formatStr: string = 'dd.MM.yyyy HH:mm:ss'): any {
    if (!value) return value;
    // Конвертируем формат moment в date-fns формат
    const dateFnsFormat = formatStr
      .replace(/DD/g, 'dd')
      .replace(/YYYY/g, 'yyyy')
      .replace(/MM/g, 'MM')
      .replace(/HH/g, 'HH')
      .replace(/mm/g, 'mm')
      .replace(/ss/g, 'ss');
    return format(new Date(value), dateFnsFormat, {locale: ru});
  }
}

@Pipe({name: 'monthYear'})
export class MonthYearPipe implements PipeTransform {

  transform(value:any): any {
    return value ? firstCharToUpperCase(format(new Date(value), "MMMM yyyy", {locale: ru})) : '';
  }
}

