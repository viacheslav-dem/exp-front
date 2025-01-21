import {Pipe, PipeTransform} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({name: 'documentType'})
export class DocumentTypePipe extends AbstractEnumPipe<DocumentType> {

  init() {
    this.map[DocumentType.PROJECT] = 'Документы заказчика';
    this.map[DocumentType.DECISION] = 'Письмо заказчику';
    this.map[DocumentType.BUREAU] = 'Документы бюро';
    this.map[DocumentType.SECTION] = 'Документы секций';
    this.map[DocumentType.REVIEW] = 'Заключения экспертов';
    this.map[DocumentType.EXPERT_CONTRACT] = 'Договоры с экспертами';
    this.map[DocumentType.EXPERT_ACT] = 'Акты сдачи-приёмки';
  }
}

export enum DocumentType {
  PROJECT = 'project',
  DECISION = 'decision',
  BUREAU = 'bureau',
  SECTION = 'section',
  REVIEW = 'review',
  EXPERT_CONTRACT = 'expertContract',
  EXPERT_ACT = 'expertAct'
}