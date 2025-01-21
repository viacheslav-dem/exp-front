export interface HighTechCriteria {
  maxScore: number;
  highTech: Criterion; //1
  // novelty: NoveltyCriteria;
  // wastelessness: Criterion;
  science: Criterion; //2
  exportOrientation: Criterion; //3
  addedValue: Criterion; //4
  isTitleProtection: Criterion; //5
  // intellectualLabor: IntellectualLaborCriteria;
}

export interface CriterionItem {

  /**
   * The score inside criterion.
   */
  w: number;

  /**
   * Global score for an item.
   */
  score: number;

  name: string;
}

export function sortCriteriaItems(items: CriterionItem[]) {
  return items.sort((i1, i2) => i1.w > i2.w ? -1 : i1.w < i2.w ? 1 : 0);
}

export interface Criterion {
  w: number;
  name: string;
  description: string;
  items: CriterionItem[];
}

export interface IntellectualLaborCriteria {
  w: number;
  name: string;
  description: string;
  engineers: Criterion;
  workers: Criterion;
}

export interface NoveltyCriteria {
  w: number;
  name: string;
  description: string;
  belarus: Criterion;
  world: Criterion;
  analogueExists: Criterion;
}
