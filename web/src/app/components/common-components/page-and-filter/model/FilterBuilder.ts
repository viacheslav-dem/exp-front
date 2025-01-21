import {Filter} from "./Filter";
import {Range} from "app/components/common-components/page-and-filter/model/Range";
import {
  DateRange, DoubleRange, IntRange,
  LongRange
} from "@app/components/common-components/page-and-filter/model/Range";

/**
 * Created by Ilya on 07.07.2017.
 */
export class FilterBuilder {

  private static createFilter<T>(key: string, value: T, type: string, filters?: Filter<any>[]): Filter<T> {
    let filter: Filter<T> = new Filter<T>();
    filter.operation = type;
    filter.key = key ? key : '';
    filter.value = value;
    filter.filters = filters;
    return filter;
  }

  public static and(key: string, filters: Filter<any>[]): Filter<any> {
    return FilterBuilder.createFilter(key, null, Operation.AND, filters);
  }

  public static or(key: string, filters: Filter<any>[]): Filter<any> {
    return FilterBuilder.createFilter(key, null, Operation.OR, filters);
  }

  public static startsWith(key: string, value: string, filters?: Filter<any>[]): Filter<string> {
    return FilterBuilder.createFilter(key, value, Operation.STARTS_WITH, filters);
  }

  public static endsWith(key: string, value: string, filters?: Filter<any>[]): Filter<string> {
    return FilterBuilder.createFilter(key, value, Operation.ENDS_WITH, filters);
  }

  public static contains(key: string, value: string, filters?: Filter<any>[]): Filter<string> {
    return FilterBuilder.createFilter(key, value, Operation.CONTAINS, filters);
  }

  public static in(key: string, value: any[], filters?: Filter<any>[]): Filter<any[]> {
    return FilterBuilder.createFilter(key, value, Operation.IN, filters);
  }

  public static inSet(key: string, value: any[], filters?: Filter<any>[]): Filter<any[]> {
    return FilterBuilder.createFilter(key, value, Operation.IN_SET, filters);
  }

  public static intRange(key: string, start: number, end: number, filters?: Filter<any>[]): Filter<IntRange> {
    return FilterBuilder.createFilter(key, new IntRange(start, end), Operation.RANGE, filters);
  }

  public static doubleRange(key: string, start: number, end: number, filters?: Filter<any>[]): Filter<DoubleRange> {
    return FilterBuilder.createFilter(key, new DoubleRange(start, end), Operation.RANGE, filters);
  }

  public static longRange(key: string, start: number, end: number, filters?: Filter<any>[]): Filter<LongRange> {
    return FilterBuilder.createFilter(key, new LongRange(start, end), Operation.RANGE, filters);
  }

  public static dateRange(key: string, start: number, end: number, filters?: Filter<any>[]): Filter<DateRange> {
    return FilterBuilder.createFilter(key, new DateRange(start, end), Operation.RANGE, filters);
  }

  public static range(key: string, range: Range<any>, filters?: Filter<any>[]): Filter<Range<any>> {
    return FilterBuilder.createFilter(key, range, Operation.RANGE, filters);
  }

  public static equals(key: string, value: any, filters?: Filter<any>[]): Filter<any> {
    return FilterBuilder.createFilter(key, value, Operation.EQUALS, filters);
  }

  public static max(key: string): Filter<any> {
    return FilterBuilder.createFilter(key, null, Operation.MAX);
  }

  public static min(key: string): Filter<any> {
    return FilterBuilder.createFilter(key, null, Operation.MIN);
  }

  public static empty(): Filter<any> {
    return FilterBuilder.createFilter(null, null, Operation.NOPE);
  }

  public static isNull(field: string): Filter<any> {
    return FilterBuilder.createFilter(field, null, Operation.IS_NULL);
  }
}

export enum Operation {
  AND = 'AND',
  OR = 'OR',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  CONTAINS = 'CONTAINS',
  IN = 'IN',
  IN_SET = 'IN_SET',
  RANGE = 'RANGE',
  EQUALS = 'EQUALS',
  MAX = 'MAX',
  MIN = 'MIN',
  NOPE = 'NOPE',
  IS_NULL = 'IS_NULL'
}
