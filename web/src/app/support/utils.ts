import * as _ from "lodash";

/**
 * Создаёт хранилище стабильных clientId/trackKey для объектов БЕЗ мутации самих объектов.
 *
 * Зачем:
 * - для trackBy/@for track при id=0 (несохранённые элементы) или когда у модели нет id
 * - чтобы избежать NG0956 и лишних пересозданий DOM
 *
 * Почему WeakMap:
 * - не требует добавлять runtime-поля в DTO
 * - не протекает памятью (объект ушёл из графа — ключ исчез)
 *
 * Ограничение:
 * - если вы пересоздаёте элементы (новые объектные ссылки), им будет назначен новый ключ
 *   (обычно это нормально; если нет — держите стабильный ключ на уровне данных/модели).
 */
export function createTrackKeyStore<T extends object>(prefix: string = 'tmp:') {
  const store = new WeakMap<object, string>();

  const uuid = (): string => {
    // modern browsers
    const g: any = globalThis as any;
    if (g?.crypto?.randomUUID) {
      return g.crypto.randomUUID();
    }
    // fallback: достаточно уникально для UI-ключей, без длинных хэшей
    const r = Math.random().toString(16).slice(2);
    const t = Date.now().toString(16);
    return `${t}-${r}`;
  };

  return (obj: T): string => {
    let key = store.get(obj);
    if (!key) {
      key = `${prefix}${uuid()}`;
      store.set(obj, key);
    }
    return key;
  };
}

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

/** Имя файла без пути (защита от path traversal в имени). */
export function getBasename(fileName: string): string {
  if (!fileName) return '';
  const lastSlash = Math.max(fileName.lastIndexOf('/'), fileName.lastIndexOf('\\'));
  return lastSlash === -1 ? fileName : fileName.slice(lastSlash + 1);
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
