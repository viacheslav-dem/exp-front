import {getTime} from 'date-fns';

export class FormContent {
  date: number = getTime(new Date());
  isDefault: boolean = true;
}
