export class SortOrder {

  direction: string;
  property: string;
  ignoreCase?: boolean;

  constructor(property?: string, direction?: string, ignoreCase?: boolean) {
    this.direction = direction;
    this.property = property;
    this.ignoreCase = ignoreCase;
  }
}

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC'
}

export let SortClass = {
  ASC: 'sort-alpha-up',
  DESC: 'sort-alpha-down',
};

export function switchDirection(direction: string, nullable: boolean = true) {
  if (!direction) {
    return Direction.ASC;
  } else if (direction == Direction.ASC) {
    return Direction.DESC;
  } else if (direction == Direction.DESC && nullable) {
    return null;
  } else {
    return Direction.ASC;
  }
}

export function sortByName(keyPrefix: string = '', direction: string = Direction.ASC): SortOrder[] {
  return [
    new SortOrder(keyPrefix + 'lastName', direction),
    new SortOrder(keyPrefix + 'firstName', direction),
    new SortOrder(keyPrefix + 'middleName', direction)
  ];
}
