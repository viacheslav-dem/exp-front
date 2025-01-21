import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'academicTitleType'})
export class AcademicTitleTypePipe implements PipeTransform {
  transform(value): any {
    switch (value) {
      case AcademicTitleType.DOCENT:
        return 'доцент';
      case AcademicTitleType.PROFESSOR:
        return 'профессор';
      case AcademicTitleType.WITHOUT_TITLE:
        return 'отсутствует';
      default:
        return value;
    }
  }
}
@Pipe({name: 'academicTitle'})
export class AcademicTitlePipe implements PipeTransform {

  transform(personInfo): any {
    let res: string;
    switch (personInfo.academicTitleType) {
      case AcademicTitleType.DOCENT:
        res = 'доцент';
        break;
      case AcademicTitleType.PROFESSOR:
        res = 'профессор';
        break;
      case AcademicTitleType.WITHOUT_TITLE:
        res = 'отсутствует';
        break;
      default:
        res = personInfo.degreeType;
    }
    return res;
  }
}

export enum AcademicTitleType {
  DOCENT = 'DOCENT',
  PROFESSOR = 'PROFESSOR',
  WITHOUT_TITLE = 'WITHOUT_TITLE',
}

export function getAllAcademicTitleTypes() {
  return Object.keys(AcademicTitleType);
}