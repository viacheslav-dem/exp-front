import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'titleAndCode'})
export class ProjectPipe implements PipeTransform {

  transform(value: any): any {
    return `${value.title} (${value.code.code})`;
  }
}
