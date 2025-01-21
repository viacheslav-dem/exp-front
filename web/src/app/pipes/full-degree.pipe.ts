import {Pipe, PipeTransform} from "@angular/core";
import {DegreeType} from "@app/pipes/degree.pipe";


@Pipe({name: 'fullDegreeType'})
export class FullDegreePipe implements PipeTransform {

  transform(personInfo): any {
    let fullDegree: string[] = [];
    personInfo.fullDegrees.forEach(fd => {
      let res: string;
      switch (fd.degreeType) {
        case DegreeType.CANDIDATE:
          res = 'кандидат';
          break;
        case DegreeType.DOCTOR:
          res = 'доктор';
          break;
        default:
          res = fd.degreeType;
      }
      if (res == null && fd.scienceArea != null) {
        fullDegree.push(fd.scienceArea.nameInGen);
      }
      else if (fd.scienceArea == null) {
        fullDegree.push(res)
      }
      else fullDegree.push(res + ' ' + fd.scienceArea.nameInGen)
    });
    return fullDegree.join(', ')
  }
}
