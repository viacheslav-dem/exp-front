import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'titleAndCode'})
export class ProjectPipe implements PipeTransform {

  transform(value: any): any {
    if (!value) {
      return '';
    }

    const title = value.title || '';
    const code = value.code && value.code.code ? ` (${value.code.code})` : '';

    return `${title}${code}`;
  }
}
