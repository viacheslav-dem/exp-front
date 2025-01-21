import * as _ from "lodash";

export function sortPersonsByName(persons: any[]) {
  persons.sort((p1, p2) => {
    if (p1.personName.lastName == p2.personName.lastName) {
      if (p1.personName.firstName == p1.personName.firstName) {
        return p1.personName.middleName < p2.personName.middleName ? -1 : p1.personName.middleName > p2.personName.middleName ? 1 : 0;
      }
      return p1.personName.firstName < p2.personName.firstName ? -1 : 1;
    }
    return p1.personName.lastName < p2.personName.lastName ? -1 : 1;
  });
  return persons;
}

export function anyMatch(itemToCheck: any, ...array: any[]): boolean {
  return array.some(item => item == itemToCheck);
}

export function noneMatch(itemToCheck: any, ...array: any[]): boolean {
  return !array.some(item => item == itemToCheck);
}

export const noop = () => {
};

export function compareByField(field) {
  return (o1, o2) => o1[field] < o2[field] ? -1 : o1[field] > o2[field] ? 1 : 0
}

export function reverseCompareByField(field) {
  return (o1, o2) => o1[field] > o2[field] ? -1 : o1[field] < o2[field] ? 1 : 0
}

export function isEmptyOrNull(str: string) {
  return !str || str.trim().length == 0;
}

export function firstCharToUpperCase(str: string) {
  if (isEmptyOrNull(str)) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1, str.length);
}

export function removeFileSuffix(fileName: string): string {
  let charIndex = fileName.lastIndexOf('.');
  if (charIndex != -1) {
    return fileName.substring(0, charIndex);
  } else {
    return fileName;
  }
}

export function isDeepEqual(item: any, item2: any): boolean {
  return (_.isEqual(item, item2) && _.isEqual(item2, item));
}

export function deepClone(item: any): any{
  return _.cloneDeep(item);
}
