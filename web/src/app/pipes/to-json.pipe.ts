import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'toJson',
    standalone: false
})
export class ToJsonPipe implements PipeTransform {

  transform(value): any {
    return JSON.stringify(value, null, 2);
  }
}
