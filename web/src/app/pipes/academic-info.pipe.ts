import {Pipe, PipeTransform} from "@angular/core";
import {PersonInfoDto} from "@app/dto/PersonInfoDto";
import {DegreePipe, DegreeType} from "@app/pipes/degree.pipe";
import {AcademicTitlePipe, AcademicTitleType} from "@app/pipes/academic-title.pipe";
import {FullDegreePipe} from "@app/pipes/full-degree.pipe";


@Pipe({
    name: 'academicInfo',
    standalone: false
})
export class AcademicInfoPipe implements PipeTransform {

  constructor(private _degreePipe: DegreePipe,
              private _academicTitlePipe: AcademicTitlePipe,
              private _fullDegree: FullDegreePipe,
  ) {
  }


  transform(personInfo: PersonInfoDto):
    any {
    let arrAcademicInfo: string[] = [];
    if (personInfo.academicTitleType !== AcademicTitleType.WITHOUT_TITLE) {
      arrAcademicInfo.push(this._academicTitlePipe.transform(personInfo))
    }
    if (personInfo.fullDegrees != null && personInfo.fullDegrees.length > 0) {
      arrAcademicInfo.push(this._fullDegree.transform(personInfo));
    }

    return arrAcademicInfo.join(', ');
  }
}
