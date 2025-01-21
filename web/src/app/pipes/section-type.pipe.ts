import {Pipe, PipeTransform} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({name: 'sectionType'})
export class SectionTypePipe extends AbstractEnumPipe<SectionType> {
  init() {
    this.map[SectionType.SCIENTIFIC] = 'научная';
    this.map[SectionType.SCIENTIFIC_TECHNICAL] = 'научно-техническая';
  }
}

export enum SectionType {
  SCIENTIFIC = 'SCIENTIFIC',
  SCIENTIFIC_TECHNICAL = 'SCIENTIFIC_TECHNICAL'
}

export function getAllSectionTypes(): string[] {
  return Object.keys(SectionType);
}
