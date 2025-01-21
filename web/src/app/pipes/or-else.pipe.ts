import {Pipe, PipeTransform} from "@angular/core";
import {isString} from "util";

@Pipe({name: 'orElse'})
export class OrElsePipe implements PipeTransform {

  transform(value: any, defultValue: any): any {
    if (!value) {
      return defultValue;
    }
    if (isString(value) && value.trim().length == 0) {
      return defultValue;
    }
    return value;
  }
}
