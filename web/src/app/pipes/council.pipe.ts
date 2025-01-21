import {Pipe, PipeTransform} from "@angular/core";
import {isEmptyOrNull} from "@app/support/utils";
import {CouncilPlainDto} from "@app/dto/CouncilPlainDto";

@Pipe({name: 'councilCodeAndName'})
export class CouncilPipe implements PipeTransform {

  transform(value: CouncilPlainDto): any {
    if (!value || isEmptyOrNull(value.name) && value.code == null) {
      return 'Наименование отсутствует';
    }
    if (value.code == null) {
      return value.name;
    }
    return "№ " + value.code + (isEmptyOrNull(value.name) ? '' : " «" + value.name + "»");
  }
}
