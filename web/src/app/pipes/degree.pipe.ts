import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'degreeType'})
export class DegreeTypePipe implements PipeTransform {

  transform(value): any {
    switch (value) {
      case DegreeType.CANDIDATE:
        return 'кандидат';
      case DegreeType.DOCTOR:
        return 'доктор';
      default:
        return value;
    }
  }
}

@Pipe({name: 'degree'})
export class DegreePipe implements PipeTransform {

  transform(personInfo): any {
    let res: string;
    switch (personInfo.degreeType) {
      case DegreeType.CANDIDATE:
        res = 'кандидат';
        break;
      case DegreeType.DOCTOR:
        res = 'доктор';
        break;
      default:
        res = personInfo.degreeType;
    }
    if (res == null && personInfo.scienceArea != null) {
      return personInfo.scienceArea.name
    }
    if (personInfo.scienceArea == null) {
      return res;
    }
    return res + ' ' + personInfo.scienceArea.name;
  }
}

export enum DegreeType {
  CANDIDATE = 'CANDIDATE',
  DOCTOR = 'DOCTOR',
}

export function getAllDegreeTypes() {
  return Object.keys(DegreeType);
}
