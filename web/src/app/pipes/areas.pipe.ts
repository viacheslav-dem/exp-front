import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'areas'})
export class AreasPipe implements PipeTransform {

  transform(person): string {
    if (person.areas.length == 0) {
      return 'не указаны';
    }
    return person.areas.map(area => area.name).join(', ');
  }
}
