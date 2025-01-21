import {Pipe, PipeTransform} from "@angular/core";
import {SectionPlainDto} from "@app/dto/SectionPlainDto";
import {SectionTypePipe} from "@app/pipes/section-type.pipe";
import {firstCharToUpperCase} from "@app/support/utils";

@Pipe({name: 'sectionFullName'})
export class SectionPipe implements PipeTransform {

  constructor(private _typePipe: SectionTypePipe) {
  }

  transform(value: SectionPlainDto): any {
    if (!value) {
      return 'секция не указана';
    }
    let res = 'секция';
    let type = this._typePipe.transform(value.sectionType);
    if (type) {
      res = type + ' ' + res;
    }
    if (value.name) {
      res += " «" + value.name + "»";
    }
    return firstCharToUpperCase(res);
  }
}
