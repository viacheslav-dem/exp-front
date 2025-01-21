import {Pipe, PipeTransform} from "@angular/core";
import {PhoneDto} from "@app/dto/PhoneDto";

@Pipe({name: 'phones'})
export class PhonesPipe implements PipeTransform {

  static phoneTypes: { [key: string]: PhoneType } = {
    WORK: {
      name: 'Рабочий',
      shortName: 'раб.'
    },
    HOME: {
      name: 'Домашний',
      shortName: 'дом.'
    },
    MOBILE: {
      name: 'Мобильный',
      shortName: 'моб.'
    },
    FAX: {
      name: 'Факс',
      shortName: 'факс'
    },
  };

  transform(phones: PhoneDto[] = [], shortMark: boolean): any {
    if (shortMark) {
      return phones.map(phone => phone.phone)
        .map(phone => phone.replace(/ /g, "\u00A0").replace(/-/g, "\u2011"))
        .join(", ")
    }
    return phones.map(phone => phone.phone + "\u00A0(" + PhonesPipe.phoneTypes[phone.type].shortName + ")")
      .map(phone => phone.replace(/ /g, "\u00A0").replace(/-/g, "\u2011"))
      .join(", ");
  }
}

export interface PhoneType {
  name: string;
  shortName: string;
}
