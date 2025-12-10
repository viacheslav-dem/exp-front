import * as dayjs from 'dayjs';

export class FormContent {
  date: number = dayjs().valueOf();
  isDefault: boolean = true;
}
