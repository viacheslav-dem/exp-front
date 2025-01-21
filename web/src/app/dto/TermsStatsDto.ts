import {IdDto} from "@app/dto/IdDto";

export class TermsStatsDto extends IdDto {
  averageTime: number;
  violations: number;
  totalCount: number;

  static violationsPercent(termsStats: TermsStatsDto): number {
    return termsStats.totalCount == 0 ? 0 : termsStats.violations / termsStats.totalCount * 100;
  }
}
