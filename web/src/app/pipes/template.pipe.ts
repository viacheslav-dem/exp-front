import {Pipe, PipeTransform} from "@angular/core";
import {TemplateDocumentDto} from "@app/dto/TemplateDocumentDto";
import {isEmptyOrNull} from "@app/support/utils";

@Pipe({name: 'templateFullName'})
export class TemplatePipe implements PipeTransform {

  transform(value: TemplateDocumentDto): any {
    if (!value) {
      return value;
    }
    return value.name + (isEmptyOrNull(value.description) ? '' : ' (' + value.description + ')');
  }
}