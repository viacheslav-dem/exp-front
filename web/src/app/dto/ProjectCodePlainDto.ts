import {IdNameDto} from "@app/dto/IdNameDto";
import {TemplateType} from "@app/components/document-form/form-model/TemplateType";

export class ProjectCodePlainDto extends IdNameDto {

  code: string;
  expertReviewType: TemplateType;
  description: string;

  static isCodeIn(code: string, ...numArr) {
    return numArr.some(num => ProjectCodePlainDto.isCode(code, num));
  }

  static isCode(code: string, num) {
    let matchArray = code.match("^8\\." + num + "([^0-9].*|$)");
    return matchArray && matchArray.length > 0;
  }

  /* программы научных исследований */
  static isPni(code) {
    return ProjectCodePlainDto.isCodeIn(code, 1, 2, 15, '12НИОК(Т)Р', '12НИР', '12ОК(Т)Р');
  }

  /* научно-технические программы */
  static isNtp(code) {
    return ProjectCodePlainDto.isCodeIn(code, 3, 4, 11, 14);
  }

  /* инновационные проекты */
  static isIp(code) {
    return ProjectCodePlainDto.isCodeIn(code, 5, 7, 8, '12ИП');
  }
}
