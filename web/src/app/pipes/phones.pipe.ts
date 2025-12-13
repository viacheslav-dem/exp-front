import {Pipe, PipeTransform} from "@angular/core";
import {PhoneDto} from "@app/dto/PhoneDto";

@Pipe({
    name: 'phones',
    standalone: false
})
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

    transform(phones: PhoneDto[] = [], shortMark: boolean = false): string {
        if (!phones?.length) return '';

        return phones
            .map(phone => {
                const formatted = phone.phone
                    .replace(/ /g, "\u00A0")
                    .replace(/-/g, "\u2011");

                if (shortMark) {
                    return formatted;
                }

                const type = PhonesPipe.phoneTypes[phone.type];
                return type
                    ? `${formatted}\u00A0(${type.shortName})`
                    : formatted;
            })
            .join(", ");
    }

}

export interface PhoneType {
  name: string;
  shortName: string;
}
