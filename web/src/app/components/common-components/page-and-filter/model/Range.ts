export class Range<T> {
  excludeStart: boolean = false;
  excludeEnd: boolean = false;

  constructor(public start: T = null, public end: T = null, public type?: RangeType) {
    this.start = start;
    this.end = end;
  }
}

export enum RangeType {
  DOUBLE = 'DOUBLE',
  INTEGER = 'INTEGER',
  LONG = 'LONG',
  DATE = 'DATE'
}

export class IntRange extends Range<number> {
  constructor(start?: number, end?: number) {
    super(start, end, RangeType.INTEGER);
  }
}


export class LongRange extends Range<number> {
  constructor(start?: number, end?: number) {
    super(start, end, RangeType.LONG);
  }
}

export class DoubleRange extends Range<number> {
  constructor(start?: number, end?: number) {
    super(start, end, RangeType.DOUBLE);
  }
}

//т.к. мы дату сериализуем в Long
export class DateRange extends Range<number> {
  constructor(start?: number, end?: number) {
    super(start, end, RangeType.DATE);
  }
}
