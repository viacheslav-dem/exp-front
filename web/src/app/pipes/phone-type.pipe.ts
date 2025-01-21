import {Pipe, PipeTransform} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({name: 'phoneType'})
export class PhoneTypePipe extends AbstractEnumPipe<PhoneType> {

  init(){
      this.map[PhoneType.MOBILE] = 'Мобильный';
      this.map[PhoneType.HOME] = 'Домашний';
      this.map[PhoneType.WORK] = 'Рабочий';
      this.map[PhoneType.FAX] = 'Факс';
  }
}

export enum PhoneType {
  MOBILE = 'MOBILE',
  HOME = 'HOME',
  WORK = 'WORK',
  FAX = 'FAX'
}

export function getAllPhoneTypes() {
  return Object.keys(PhoneType);
}
