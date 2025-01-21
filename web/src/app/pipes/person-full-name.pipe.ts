import {Pipe, PipeTransform} from "@angular/core";
import {PersonNameDto} from "@app/dto/PersonNameDto";

@Pipe({name: 'fullName'})
export class PersonFullNamePipe implements PipeTransform {

  transform(value:any): any {
    let name = value;
    if (name != null && name.personName != null)
      name = name.personName;
    if (name) {
      return name.lastName + ' ' + name.firstName + ' ' + name.middleName;
    }
    return 'не указан';
  }


}
