/**
 * Created by Ilya on 12.07.2017.
 */
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'short'})
export class ShortTextPipe implements PipeTransform {

  transform(value: string, length: number): any {
    if (!value || value.length <= length)
      return value;
    let fixed: string = value.substring(0, length);
    let index = fixed.lastIndexOf(' ');
    if (index > 0) {
      fixed = fixed.substring(0, index);
    }
    return fixed + '...';
  }
}
