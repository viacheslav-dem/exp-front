import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'orElse',
    standalone: false
})
export class OrElsePipe implements PipeTransform {

  transform(value: any, defultValue: any): any {
    if (!value) {
      return defultValue;
    }
    if ( typeof value === 'string' && value.trim().length == 0) {
      return defultValue;
    }
    return value;
  }
}