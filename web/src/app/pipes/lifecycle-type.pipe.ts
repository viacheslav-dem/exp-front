import {Pipe, PipeTransform} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({name: 'lifecycleType'})
export class LifecycleTypePipe extends AbstractEnumPipe<LifecycleType>{

  init() {
      this.map[LifecycleType.COUNCIL] = 'Экспертиза в ГЭС';
      this.map[LifecycleType.SECTION] = 'Экспертиза в секции';
      this.map[LifecycleType.EXPERT] = 'Заключение эксперта';
      this.map[LifecycleType.PROJECT] = 'Объект экспертизы';
  }
}

export enum LifecycleType {
  PROJECT = 'PROJECT',
  SECTION = 'SECTION',
  COUNCIL = 'COUNCIL',
  EXPERT = 'EXPERT',
}
