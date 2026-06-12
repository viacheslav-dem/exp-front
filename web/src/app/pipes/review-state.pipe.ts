import {Pipe} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({
    name: 'reviewState',
    standalone: false
})
export class ReviewStatePipe extends AbstractEnumPipe<ExpertReviewState> {

  init() {
    this.map[ExpertReviewState.PROJECT_ACCEPTED] = 'Рекомендован';
    this.map[ExpertReviewState.PROJECT_REJECTED] = 'Не рекомендован';
    this.map[ExpertReviewState.REJECTED] = 'Отклонена';
    this.map[ExpertReviewState.ON_EXPERT_CONFIRMATION] = 'Ожидание эксперта';
    this.map[ExpertReviewState.ON_GKNT_CONFIRMATION] = 'На согласовании эксперта';
    this.map[ExpertReviewState.ON_EXAMINATION] = 'На экспертизе';
  }
}

export enum ExpertReviewState {
  ON_EXPERT_CONFIRMATION = 'ON_EXPERT_CONFIRMATION', // ожидается согласие эксперта на проведение экспертизы
  ON_GKNT_CONFIRMATION = 'ON_GKNT_CONFIRMATION', // ожидается согласие ГКНТ на назначение эксперта
  ON_EXAMINATION = 'ON_EXAMINATION', // эксперт проводит экспертизу проекта
  PROJECT_ACCEPTED = 'PROJECT_ACCEPTED', // эксперт рекомендовал проект
  PROJECT_REJECTED = 'PROJECT_REJECTED', // эксперт не рекомендовал проект
  REJECTED = 'REJECTED', // назначение эксперта не состоялось
}

export enum ExpertReviewStateBadge {
  ON_EXPERT_CONFIRMATION = 'badge-info', // ожидается согласие эксперта на проведение экспертизы
  ON_GKNT_CONFIRMATION = 'badge-info', // ожидается согласие ГКНТ на назначение эксперта
  ON_EXAMINATION = 'badge-info', // эксперт проводит экспертизу проекта
  PROJECT_ACCEPTED = 'badge-success', // эксперт рекомендовал проект
  PROJECT_REJECTED = 'badge-danger', // эксперт не рекомендовал проект
  REJECTED = 'badge-danger', // назначение эксперта не состоялось
}

export enum ExpertReviewTermsMessages {
  ON_EXPERT_CONFIRMATION = 'Принять решение',
  ON_EXAMINATION = 'Завершить экспертизу',
}
